package entity

import "time"

// PaymentMethod 決済方法
type PaymentMethod string

const (
	PaymentMethodCreditCard   PaymentMethod = "credit_card"
	PaymentMethodBankTransfer PaymentMethod = "bank_transfer"
	PaymentMethodPoints       PaymentMethod = "points"
	PaymentMethodCombined     PaymentMethod = "combined" // ポイント併用
)

// PaymentStatus 決済ステータス
type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusCompleted PaymentStatus = "completed"
	PaymentStatusFailed    PaymentStatus = "failed"
	PaymentStatusRefunded  PaymentStatus = "refunded"
)

// Payment 決済エンティティ
type Payment struct {
	ID                 string
	OrderID            string
	Method             PaymentMethod
	Status             PaymentStatus
	Amount             int
	PointsUsed         int
	CashAmount         int // 現金決済額（ポイント併用時）
	TransactionID      string
	ProcessedAt        time.Time
	RefundedAt         time.Time
	RefundAmount       int
	RefundPointsReturn int
}

// IsCompleted 決済が完了しているかどうか
func (p *Payment) IsCompleted() bool {
	return p.Status == PaymentStatusCompleted
}

// CanRefund 返金可能かどうか
func (p *Payment) CanRefund() bool {
	return p.Status == PaymentStatusCompleted && p.RefundAmount == 0
}

// GetRefundableAmount 返金可能額を取得
func (p *Payment) GetRefundableAmount() int {
	return p.Amount - p.RefundAmount
}

// IsPointsPayment ポイント決済かどうか
func (p *Payment) IsPointsPayment() bool {
	return p.Method == PaymentMethodPoints || p.Method == PaymentMethodCombined
}

// Pricing 価格計算結果
type Pricing struct {
	SubTotal          int     // 商品小計
	MemberDiscount    int     // 会員割引額
	CouponDiscount    int     // クーポン割引額
	ShippingFee       int     // 配送料
	Tax               int     // 消費税
	TotalAmount       int     // 合計金額
	PointsToEarn      int     // 獲得予定ポイント
	AppliedCouponCode string  // 適用クーポンコード
	TaxRate           float64 // 税率
}

// GetDiscountTotal 割引合計を取得
func (p *Pricing) GetDiscountTotal() int {
	return p.MemberDiscount + p.CouponDiscount
}

// GetNetAmount 割引後の商品金額を取得
func (p *Pricing) GetNetAmount() int {
	return p.SubTotal - p.GetDiscountTotal()
}
