//go:generate sh -c "cd ../../ && go run internal/logic/*.go"
package usecase

import (
	"context"
	"time"

	"github.com/shibuya-mizuho/logic-mermaid-pages/application/service"
	"github.com/shibuya-mizuho/logic-mermaid-pages/application/validator"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// IOrderCreateUseCase 注文作成ユースケースインターフェース
type IOrderCreateUseCase interface {
	CreateOrder(ctx context.Context, req validator.CreateOrderRequest) (*entity.Order, error)
}

// OrderCreateUseCase 注文作成ユースケース
type OrderCreateUseCase struct {
	customerRepo        repository.ICustomerRepository
	orderRepo           repository.IOrderRepository
	cartService         service.ICartService
	inventoryService    service.IInventoryService
	pricingService      service.IPricingService
	couponService       service.ICouponService
	paymentService      service.IPaymentService
	shippingService     service.IShippingService
	notificationService service.INotificationService
	orderValidator      validator.IOrderValidator
}

// NewOrderCreateUseCase コンストラクタ
func NewOrderCreateUseCase(
	customerRepo repository.ICustomerRepository,
	orderRepo repository.IOrderRepository,
	cartService service.ICartService,
	inventoryService service.IInventoryService,
	pricingService service.IPricingService,
	couponService service.ICouponService,
	paymentService service.IPaymentService,
	shippingService service.IShippingService,
	notificationService service.INotificationService,
	orderValidator validator.IOrderValidator,
) *OrderCreateUseCase {
	return &OrderCreateUseCase{
		customerRepo:        customerRepo,
		orderRepo:           orderRepo,
		cartService:         cartService,
		inventoryService:    inventoryService,
		pricingService:      pricingService,
		couponService:       couponService,
		paymentService:      paymentService,
		shippingService:     shippingService,
		notificationService: notificationService,
		orderValidator:      orderValidator,
	}
}

// CreateOrder 注文を作成する
func (uc *OrderCreateUseCase) CreateOrder(ctx context.Context, req validator.CreateOrderRequest) (*entity.Order, error) {
	// 1. リクエストのバリデーション
	if err := uc.orderValidator.ValidateCreateOrder(req); err != nil {
		return nil, err
	}

	// 2. 顧客情報を取得
	customer, err := uc.customerRepo.GetByID(ctx, req.CustomerID)
	if err != nil {
		return nil, err
	}

	// 3. カート情報を取得
	cart, err := uc.cartService.GetCart(ctx, req.CartID)
	if err != nil {
		return nil, err
	}

	// 4. カートアイテムの有効性を検証
	if err := uc.cartService.ValidateCartItems(ctx, cart); err != nil {
		return nil, err
	}

	// 5. 在庫を予約（引当）
	if err := uc.inventoryService.ReserveStock(ctx, cart.Items); err != nil {
		return nil, err
	}

	// 6. 価格を計算
	pricing, err := uc.pricingService.Calculate(ctx, cart, customer, req.ShippingMethod)
	if err != nil {
		// 在庫を解放
		uc.inventoryService.ReleaseStock(ctx, cart.Items)
		return nil, err
	}

	// 7. クーポンを適用（指定がある場合）
	var appliedCoupon *repository.Coupon
	if req.CouponCode != "" {
		coupon, err := uc.couponService.ValidateCoupon(ctx, req.CouponCode, cart, customer)
		if err != nil {
			// 在庫を解放
			uc.inventoryService.ReleaseStock(ctx, cart.Items)
			return nil, err
		}

		if err := uc.couponService.ApplyCoupon(ctx, coupon, pricing, cart); err != nil {
			// 在庫を解放
			uc.inventoryService.ReleaseStock(ctx, cart.Items)
			return nil, err
		}
		appliedCoupon = coupon
	}

	// 8. 決済を処理
	payment, err := uc.paymentService.ProcessPayment(ctx, pricing, req.PaymentMethod, req.PointsToUse, customer)
	if err != nil {
		// 在庫を解放
		uc.inventoryService.ReleaseStock(ctx, cart.Items)
		return nil, err
	}

	// 9. 配送を手配
	shipping, err := uc.shippingService.ArrangeShipping(ctx, req.ShippingMethod, req.ShippingAddress, cart)
	if err != nil {
		// 決済をキャンセル（実際にはPaymentServiceにキャンセルメソッドが必要）
		uc.inventoryService.ReleaseStock(ctx, cart.Items)
		return nil, err
	}

	// 10. 注文を作成
	order := &entity.Order{
		CustomerID:  customer.ID,
		Customer:    customer,
		Cart:        cart,
		Pricing:     pricing,
		Payment:     payment,
		Shipping:    shipping,
		Status:      entity.OrderStatusConfirmed,
		CouponCode:  req.CouponCode,
		Notes:       req.Notes,
		ConfirmedAt: time.Now(),
	}

	// 11. 注文を保存
	if err := uc.orderRepo.Create(ctx, order); err != nil {
		// ロールバック処理
		uc.inventoryService.ReleaseStock(ctx, cart.Items)
		return nil, err
	}

	// 決済情報に注文IDを設定
	payment.OrderID = order.ID

	// 12. 在庫を確定
	if err := uc.inventoryService.CommitStock(ctx, cart.Items); err != nil {
		// 注文は作成されているが、在庫確定に失敗
		// 実際にはアラートを発行するなどの対応が必要
		return nil, err
	}

	// 13. クーポンを使用済みにする
	if appliedCoupon != nil {
		if err := uc.couponService.UseCoupon(ctx, appliedCoupon.Code); err != nil {
			// クーポン使用記録に失敗してもオーダーは成功とする
			// ログに警告を出す程度
		}
	}

	// 14. カートをクリア
	if err := uc.cartService.ClearCart(ctx, cart.ID); err != nil {
		// カートクリアに失敗しても注文は成功とする
	}

	// 15. 注文確認通知を非同期で送信
	go func() {
		if err := uc.notificationService.SendOrderConfirmation(ctx, customer, order); err != nil {
			// 通知送信失敗はログに記録するが、注文自体は成功
		}
	}()

	return order, nil
}
