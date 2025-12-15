//go:generate sh -c "cd ../../ && go run internal/logic/*.go"
package usecase

import (
	"context"

	"github.com/shibuya-mizuho/logic-mermaid-pages/application/service"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// OrderStatusResponse 注文ステータスレスポンス
type OrderStatusResponse struct {
	Order         *entity.Order
	Summary       *entity.OrderSummary
	StatusMessage string
	NextActions   []string
	CanCancel     bool
	CanRefund     bool
	TrackingInfo  *TrackingInfo
}

// TrackingInfo 追跡情報
type TrackingInfo struct {
	TrackingNumber string
	Carrier        string
	Status         string
	EstimatedDate  string
	CurrentStatus  string
}

// IOrderStatusUseCase 注文ステータス確認ユースケースインターフェース
type IOrderStatusUseCase interface {
	GetOrderStatus(ctx context.Context, orderID string) (*OrderStatusResponse, error)
	GetCustomerOrders(ctx context.Context, customerID string) ([]*OrderStatusResponse, error)
}

// OrderStatusUseCase 注文ステータス確認ユースケース
type OrderStatusUseCase struct {
	orderRepo       repository.IOrderRepository
	customerRepo    repository.ICustomerRepository
	shippingService service.IShippingService
}

// NewOrderStatusUseCase コンストラクタ
func NewOrderStatusUseCase(
	orderRepo repository.IOrderRepository,
	customerRepo repository.ICustomerRepository,
	shippingService service.IShippingService,
) *OrderStatusUseCase {
	return &OrderStatusUseCase{
		orderRepo:       orderRepo,
		customerRepo:    customerRepo,
		shippingService: shippingService,
	}
}

// GetOrderStatus 注文ステータスを取得する
func (uc *OrderStatusUseCase) GetOrderStatus(ctx context.Context, orderID string) (*OrderStatusResponse, error) {
	// 1. 注文を取得
	order, err := uc.orderRepo.GetByID(ctx, orderID)
	if err != nil {
		return nil, err
	}

	// 2. ステータスレスポンスを作成
	response := uc.buildStatusResponse(order)

	return response, nil
}

// GetCustomerOrders 顧客の注文一覧を取得する
func (uc *OrderStatusUseCase) GetCustomerOrders(ctx context.Context, customerID string) ([]*OrderStatusResponse, error) {
	// 1. 顧客の存在確認
	_, err := uc.customerRepo.GetByID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	// 2. 注文一覧を取得
	orders, err := uc.orderRepo.GetByCustomerID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	// 3. レスポンスを作成
	responses := make([]*OrderStatusResponse, 0, len(orders))
	for _, order := range orders {
		response := uc.buildStatusResponse(order)
		responses = append(responses, response)
	}

	return responses, nil
}

// buildStatusResponse ステータスレスポンスを作成する
func (uc *OrderStatusUseCase) buildStatusResponse(order *entity.Order) *OrderStatusResponse {
	response := &OrderStatusResponse{
		Order:       order,
		Summary:     order.GetOrderSummary(),
		CanCancel:   order.CanCancel(),
		CanRefund:   order.CanRefund(),
		NextActions: uc.getNextActions(order),
	}

	// ステータスメッセージを設定
	response.StatusMessage = uc.getStatusMessage(order.Status)

	// 追跡情報を設定
	if order.Shipping != nil && order.Shipping.TrackingNumber != "" {
		response.TrackingInfo = uc.buildTrackingInfo(order)
	}

	return response
}

// getStatusMessage ステータスに応じたメッセージを取得
func (uc *OrderStatusUseCase) getStatusMessage(status entity.OrderStatus) string {
	switch status {
	case entity.OrderStatusPending:
		return "ご注文を受け付けました。確認をお待ちください。"
	case entity.OrderStatusConfirmed:
		return "ご注文が確定しました。発送準備中です。"
	case entity.OrderStatusProcessing:
		return "ご注文の発送準備を行っています。"
	case entity.OrderStatusShipped:
		return "ご注文の商品を発送しました。"
	case entity.OrderStatusDelivered:
		return "ご注文の商品が配送完了しました。"
	case entity.OrderStatusCancelled:
		return "ご注文はキャンセルされました。"
	case entity.OrderStatusRefunded:
		return "ご注文は返金処理が完了しました。"
	default:
		return "注文ステータスを確認中です。"
	}
}

// getNextActions 次に可能なアクションを取得
func (uc *OrderStatusUseCase) getNextActions(order *entity.Order) []string {
	actions := make([]string, 0)

	switch order.Status {
	case entity.OrderStatusPending, entity.OrderStatusConfirmed, entity.OrderStatusProcessing:
		actions = append(actions, "キャンセル")
	case entity.OrderStatusShipped:
		actions = append(actions, "配送追跡")
	case entity.OrderStatusDelivered:
		if order.CanRefund() {
			actions = append(actions, "返金申請")
		}
		actions = append(actions, "レビューを書く")
		actions = append(actions, "再注文")
	case entity.OrderStatusCancelled, entity.OrderStatusRefunded:
		actions = append(actions, "再注文")
	}

	return actions
}

// buildTrackingInfo 追跡情報を作成
func (uc *OrderStatusUseCase) buildTrackingInfo(order *entity.Order) *TrackingInfo {
	if order.Shipping == nil {
		return nil
	}

	info := &TrackingInfo{
		TrackingNumber: order.Shipping.TrackingNumber,
		Carrier:        uc.getCarrierName(order.Shipping.Method),
	}

	// 配送ステータスを判定
	if order.Shipping.IsDelivered() {
		info.Status = "delivered"
		info.CurrentStatus = "配送完了"
	} else if !order.Shipping.ShippedAt.IsZero() {
		info.Status = "in_transit"
		info.CurrentStatus = "配送中"
		info.EstimatedDate = order.Shipping.EstimatedDate.Format("2006/01/02")
	} else {
		info.Status = "preparing"
		info.CurrentStatus = "発送準備中"
		info.EstimatedDate = order.Shipping.EstimatedDate.Format("2006/01/02")
	}

	return info
}

// getCarrierName 配送業者名を取得
func (uc *OrderStatusUseCase) getCarrierName(method entity.ShippingMethod) string {
	switch method {
	case entity.ShippingMethodExpress:
		return "速達便"
	case entity.ShippingMethodPickup:
		return "店舗受取"
	default:
		return "通常配送"
	}
}
