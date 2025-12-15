package validator

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// CreateOrderRequest 注文作成リクエスト
type CreateOrderRequest struct {
	CustomerID      string                `json:"customer_id"`
	CartID          string                `json:"cart_id"`
	CouponCode      string                `json:"coupon_code,omitempty"`
	PaymentMethod   entity.PaymentMethod  `json:"payment_method"`
	PointsToUse     int                   `json:"points_to_use,omitempty"`
	ShippingMethod  entity.ShippingMethod `json:"shipping_method"`
	ShippingAddress *ShippingAddressInput `json:"shipping_address"`
	Notes           string                `json:"notes,omitempty"`
}

// ShippingAddressInput 配送先住所入力
type ShippingAddressInput struct {
	PostalCode    string `json:"postal_code"`
	Prefecture    string `json:"prefecture"`
	City          string `json:"city"`
	AddressLine1  string `json:"address_line1"`
	AddressLine2  string `json:"address_line2,omitempty"`
	PhoneNumber   string `json:"phone_number"`
	RecipientName string `json:"recipient_name"`
}

// RefundRequest 返金リクエスト
type RefundRequest struct {
	OrderID string `json:"order_id"`
	Reason  string `json:"reason"`
}

// IOrderValidator 注文バリデーターインターフェース
type IOrderValidator interface {
	ValidateCreateOrder(req CreateOrderRequest) error
	ValidateRefund(req RefundRequest) error
	ValidateShippingAddress(addr *ShippingAddressInput) error
}

// OrderValidator 注文バリデーター
type OrderValidator struct{}

// NewOrderValidator コンストラクタ
func NewOrderValidator() *OrderValidator {
	return &OrderValidator{}
}

// ValidateCreateOrder 注文作成リクエストのバリデーション
func (v *OrderValidator) ValidateCreateOrder(req CreateOrderRequest) error {
	// 基本バリデーション
	if err := validation.ValidateStruct(&req,
		validation.Field(&req.CustomerID, validation.Required, validation.Length(1, 100)),
		validation.Field(&req.CartID, validation.Required, validation.Length(1, 100)),
		validation.Field(&req.PaymentMethod, validation.Required, validation.In(
			entity.PaymentMethodCreditCard,
			entity.PaymentMethodBankTransfer,
			entity.PaymentMethodPoints,
			entity.PaymentMethodCombined,
		)),
		validation.Field(&req.ShippingMethod, validation.Required, validation.In(
			entity.ShippingMethodStandard,
			entity.ShippingMethodExpress,
			entity.ShippingMethodPickup,
		)),
		validation.Field(&req.PointsToUse, validation.Min(0)),
		validation.Field(&req.Notes, validation.Length(0, 500)),
	); err != nil {
		return err
	}

	// 店舗受取以外は配送先住所が必須
	if req.ShippingMethod != entity.ShippingMethodPickup {
		if req.ShippingAddress == nil {
			return &entity.ValidationError{
				Field:   "shipping_address",
				Message: "配送先住所は必須です（店舗受取を除く）",
			}
		}
		if err := v.ValidateShippingAddress(req.ShippingAddress); err != nil {
			return err
		}
	}

	// ポイント決済またはポイント併用の場合、ポイント使用額が必須
	if req.PaymentMethod == entity.PaymentMethodPoints || req.PaymentMethod == entity.PaymentMethodCombined {
		if req.PointsToUse <= 0 {
			return &entity.ValidationError{
				Field:   "points_to_use",
				Message: "ポイント決済の場合は使用ポイントを指定してください",
			}
		}
	}

	return nil
}

// ValidateRefund 返金リクエストのバリデーション
func (v *OrderValidator) ValidateRefund(req RefundRequest) error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.OrderID, validation.Required, validation.Length(1, 100)),
		validation.Field(&req.Reason, validation.Required, validation.Length(1, 500)),
	)
}

// ValidateShippingAddress 配送先住所のバリデーション
func (v *OrderValidator) ValidateShippingAddress(addr *ShippingAddressInput) error {
	if addr == nil {
		return &entity.ValidationError{
			Field:   "shipping_address",
			Message: "配送先住所は必須です",
		}
	}

	return validation.ValidateStruct(addr,
		validation.Field(&addr.PostalCode, validation.Required, validation.Length(7, 8)),
		validation.Field(&addr.Prefecture, validation.Required, validation.Length(2, 4)),
		validation.Field(&addr.City, validation.Required, validation.Length(1, 100)),
		validation.Field(&addr.AddressLine1, validation.Required, validation.Length(1, 200)),
		validation.Field(&addr.AddressLine2, validation.Length(0, 200)),
		validation.Field(&addr.PhoneNumber, validation.Required, validation.Length(10, 15)),
		validation.Field(&addr.RecipientName, validation.Required, validation.Length(1, 100)),
	)
}
