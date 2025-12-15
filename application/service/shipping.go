package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/shibuya-mizuho/logic-mermaid-pages/application/validator"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// IShippingService 配送サービスインターフェース
type IShippingService interface {
	ArrangeShipping(ctx context.Context, method entity.ShippingMethod, address *validator.ShippingAddressInput, cart *entity.Cart) (*entity.Shipping, error)
	CalculateEstimatedDelivery(method entity.ShippingMethod) time.Time
	UpdateShippingStatus(ctx context.Context, shipping *entity.Shipping, status string) error
}

// ShippingService 配送サービス
type ShippingService struct{}

// NewShippingService コンストラクタ
func NewShippingService() *ShippingService {
	return &ShippingService{}
}

// ArrangeShipping 配送を手配
func (s *ShippingService) ArrangeShipping(ctx context.Context, method entity.ShippingMethod, address *validator.ShippingAddressInput, cart *entity.Cart) (*entity.Shipping, error) {
	shipping := &entity.Shipping{
		Method:        method,
		EstimatedDate: s.CalculateEstimatedDelivery(method),
	}

	// 店舗受取以外は配送先住所を設定
	if method != entity.ShippingMethodPickup {
		if address == nil {
			return nil, &entity.ValidationError{
				Field:   "shipping_address",
				Message: "配送先住所が必要です",
			}
		}

		shipping.Address = &entity.ShippingAddress{
			PostalCode:    address.PostalCode,
			Prefecture:    address.Prefecture,
			City:          address.City,
			AddressLine1:  address.AddressLine1,
			AddressLine2:  address.AddressLine2,
			PhoneNumber:   address.PhoneNumber,
			RecipientName: address.RecipientName,
		}

		// 追跡番号を発行（モック）
		shipping.TrackingNumber = s.generateTrackingNumber(method)
	}

	// 配送料を計算
	shipping.Fee = s.calculateShippingFee(method, cart)

	return shipping, nil
}

// CalculateEstimatedDelivery 配送予定日を計算
func (s *ShippingService) CalculateEstimatedDelivery(method entity.ShippingMethod) time.Time {
	now := time.Now()

	switch method {
	case entity.ShippingMethodExpress:
		// 速達: 翌日
		return now.AddDate(0, 0, 1)
	case entity.ShippingMethodPickup:
		// 店舗受取: 3日後
		return now.AddDate(0, 0, 3)
	default:
		// 通常配送: 3-5日後
		return now.AddDate(0, 0, 5)
	}
}

// UpdateShippingStatus 配送ステータスを更新
func (s *ShippingService) UpdateShippingStatus(ctx context.Context, shipping *entity.Shipping, status string) error {
	switch status {
	case "shipped":
		shipping.ShippedAt = time.Now()
	case "delivered":
		shipping.DeliveredAt = time.Now()
	}
	return nil
}

// generateTrackingNumber 追跡番号を生成（モック）
func (s *ShippingService) generateTrackingNumber(method entity.ShippingMethod) string {
	prefix := "STD"
	switch method {
	case entity.ShippingMethodExpress:
		prefix = "EXP"
	case entity.ShippingMethodPickup:
		prefix = "PKP"
	}
	return prefix + "-" + uuid.New().String()[:8]
}

// calculateShippingFee 配送料を計算
func (s *ShippingService) calculateShippingFee(method entity.ShippingMethod, cart *entity.Cart) int {
	// 店舗受取は無料
	if method == entity.ShippingMethodPickup {
		return 0
	}

	// 一定金額以上で送料無料
	if cart.GetTotalAmount() >= FreeShippingThreshold {
		return 0
	}

	// 基本配送料
	baseFee := StandardShippingFee
	if method == entity.ShippingMethodExpress {
		baseFee = ExpressShippingFee
	}

	// 重量による追加料金
	if cart.GetTotalWeight() >= HeavyWeightThreshold {
		baseFee += HeavyWeightFee
	}

	return baseFee
}
