package entity

import "time"

// OrderStatus 注文ステータス
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"    // 注文受付中
	OrderStatusConfirmed  OrderStatus = "confirmed"  // 注文確定
	OrderStatusProcessing OrderStatus = "processing" // 処理中
	OrderStatusShipped    OrderStatus = "shipped"    // 発送済み
	OrderStatusDelivered  OrderStatus = "delivered"  // 配送完了
	OrderStatusCancelled  OrderStatus = "cancelled"  // キャンセル
	OrderStatusRefunded   OrderStatus = "refunded"   // 返金済み
)

// ShippingMethod 配送方法
type ShippingMethod string

const (
	ShippingMethodStandard ShippingMethod = "standard" // 通常配送
	ShippingMethodExpress  ShippingMethod = "express"  // 速達
	ShippingMethodPickup   ShippingMethod = "pickup"   // 店舗受取
)

// ShippingAddress 配送先住所
type ShippingAddress struct {
	PostalCode    string
	Prefecture    string
	City          string
	AddressLine1  string
	AddressLine2  string
	PhoneNumber   string
	RecipientName string
}

// Shipping 配送情報
type Shipping struct {
	Method         ShippingMethod
	Address        *ShippingAddress
	TrackingNumber string
	EstimatedDate  time.Time
	ShippedAt      time.Time
	DeliveredAt    time.Time
	Fee            int
}

// IsDelivered 配送完了かどうか
func (s *Shipping) IsDelivered() bool {
	return !s.DeliveredAt.IsZero()
}

// Order 注文エンティティ
type Order struct {
	ID           string
	CustomerID   string
	Customer     *Customer
	Cart         *Cart
	Pricing      *Pricing
	Payment      *Payment
	Shipping     *Shipping
	Status       OrderStatus
	CouponCode   string
	Notes        string
	CreatedAt    time.Time
	UpdatedAt    time.Time
	ConfirmedAt  time.Time
	CancelledAt  time.Time
	CancelReason string
}

// CanCancel キャンセル可能かどうか
func (o *Order) CanCancel() bool {
	// 発送前のみキャンセル可能
	return o.Status == OrderStatusPending ||
		o.Status == OrderStatusConfirmed ||
		o.Status == OrderStatusProcessing
}

// CanRefund 返金可能かどうか
func (o *Order) CanRefund() bool {
	// 配送完了後7日以内のみ返金可能
	if o.Status != OrderStatusDelivered {
		return false
	}
	if o.Shipping == nil || o.Shipping.DeliveredAt.IsZero() {
		return false
	}
	refundDeadline := o.Shipping.DeliveredAt.AddDate(0, 0, 7)
	return time.Now().Before(refundDeadline)
}

// IsCompleted 注文が完了しているかどうか
func (o *Order) IsCompleted() bool {
	return o.Status == OrderStatusDelivered
}

// IsCancelled 注文がキャンセルされているかどうか
func (o *Order) IsCancelled() bool {
	return o.Status == OrderStatusCancelled || o.Status == OrderStatusRefunded
}

// GetOrderSummary 注文サマリを取得
type OrderSummary struct {
	OrderID       string
	Status        OrderStatus
	TotalAmount   int
	ItemCount     int
	OrderDate     time.Time
	EstimatedDate time.Time
}

func (o *Order) GetOrderSummary() *OrderSummary {
	summary := &OrderSummary{
		OrderID:   o.ID,
		Status:    o.Status,
		OrderDate: o.CreatedAt,
	}
	if o.Pricing != nil {
		summary.TotalAmount = o.Pricing.TotalAmount
	}
	if o.Cart != nil {
		summary.ItemCount = o.Cart.GetItemCount()
	}
	if o.Shipping != nil {
		summary.EstimatedDate = o.Shipping.EstimatedDate
	}
	return summary
}
