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

// IOrderRefundUseCase 返金ユースケースインターフェース
type IOrderRefundUseCase interface {
	RefundOrder(ctx context.Context, req validator.RefundRequest) (*entity.Order, error)
}

// OrderRefundUseCase 返金ユースケース
type OrderRefundUseCase struct {
	customerRepo        repository.ICustomerRepository
	orderRepo           repository.IOrderRepository
	inventoryService    service.IInventoryService
	paymentService      service.IPaymentService
	notificationService service.INotificationService
	orderValidator      validator.IOrderValidator
}

// NewOrderRefundUseCase コンストラクタ
func NewOrderRefundUseCase(
	customerRepo repository.ICustomerRepository,
	orderRepo repository.IOrderRepository,
	inventoryService service.IInventoryService,
	paymentService service.IPaymentService,
	notificationService service.INotificationService,
	orderValidator validator.IOrderValidator,
) *OrderRefundUseCase {
	return &OrderRefundUseCase{
		customerRepo:        customerRepo,
		orderRepo:           orderRepo,
		inventoryService:    inventoryService,
		paymentService:      paymentService,
		notificationService: notificationService,
		orderValidator:      orderValidator,
	}
}

// RefundOrder 注文を返金する
func (uc *OrderRefundUseCase) RefundOrder(ctx context.Context, req validator.RefundRequest) (*entity.Order, error) {
	// 1. リクエストのバリデーション
	if err := uc.orderValidator.ValidateRefund(req); err != nil {
		return nil, err
	}

	// 2. 注文を取得
	order, err := uc.orderRepo.GetByID(ctx, req.OrderID)
	if err != nil {
		return nil, err
	}

	// 3. 返金可能かチェック
	if !order.CanRefund() {
		return nil, &entity.OrderStateError{
			OrderID:       order.ID,
			CurrentStatus: order.Status,
			Operation:     "refund",
		}
	}

	// 4. 顧客情報を取得
	customer, err := uc.customerRepo.GetByID(ctx, order.CustomerID)
	if err != nil {
		return nil, err
	}

	// 5. 決済情報のチェック
	if order.Payment == nil {
		return nil, &entity.RefundError{
			OrderID: order.ID,
			Reason:  "決済情報が見つかりません",
		}
	}

	// 6. 決済の返金処理
	if err := uc.paymentService.RefundPayment(ctx, order.Payment, customer); err != nil {
		return nil, err
	}

	// 7. 在庫を復元
	if order.Cart != nil && len(order.Cart.Items) > 0 {
		if err := uc.inventoryService.RestoreStock(ctx, order.Cart.Items); err != nil {
			// 在庫復元に失敗しても返金自体は完了とする
			// ログに警告を出す
		}
	}

	// 8. 注文ステータスを更新
	order.Status = entity.OrderStatusRefunded
	order.CancelledAt = time.Now()
	order.CancelReason = req.Reason

	// 9. 注文を保存
	if err := uc.orderRepo.Update(ctx, order); err != nil {
		return nil, err
	}

	// 10. 返金完了通知を非同期で送信
	go func() {
		if err := uc.notificationService.SendRefundNotification(ctx, customer, order); err != nil {
			// 通知送信失敗はログに記録
		}
	}()

	return order, nil
}
