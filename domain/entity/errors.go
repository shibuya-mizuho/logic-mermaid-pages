package entity

import "fmt"

// ValidationError バリデーションエラー
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error: %s - %s", e.Field, e.Message)
}

// NotFoundError リソースが見つからないエラー
type NotFoundError struct {
	Resource string
	ID       string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found: %s", e.Resource, e.ID)
}

// InsufficientStockError 在庫不足エラー
type InsufficientStockError struct {
	ProductID string
	Requested int
	Available int
}

func (e *InsufficientStockError) Error() string {
	return fmt.Sprintf("insufficient stock for product %s: requested %d, available %d", e.ProductID, e.Requested, e.Available)
}

// InsufficientPointsError ポイント不足エラー
type InsufficientPointsError struct {
	CustomerID string
	Requested  int
	Available  int
}

func (e *InsufficientPointsError) Error() string {
	return fmt.Sprintf("insufficient points for customer %s: requested %d, available %d", e.CustomerID, e.Requested, e.Available)
}

// PaymentError 決済エラー
type PaymentError struct {
	Reason string
	Code   string
}

func (e *PaymentError) Error() string {
	return fmt.Sprintf("payment failed: %s (code: %s)", e.Reason, e.Code)
}

// CouponError クーポンエラー
type CouponError struct {
	Code   string
	Reason string
}

func (e *CouponError) Error() string {
	return fmt.Sprintf("coupon error for %s: %s", e.Code, e.Reason)
}

// OrderStateError 注文状態エラー
type OrderStateError struct {
	OrderID       string
	CurrentStatus OrderStatus
	Operation     string
}

func (e *OrderStateError) Error() string {
	return fmt.Sprintf("cannot %s order %s in status %s", e.Operation, e.OrderID, e.CurrentStatus)
}

// RefundError 返金エラー
type RefundError struct {
	OrderID string
	Reason  string
}

func (e *RefundError) Error() string {
	return fmt.Sprintf("refund failed for order %s: %s", e.OrderID, e.Reason)
}
