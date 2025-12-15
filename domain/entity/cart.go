package entity

import "time"

// CartItem カートアイテム
type CartItem struct {
	ProductID string
	Product   *Product
	Quantity  int
	AddedAt   time.Time
}

// GetSubtotal アイテムの小計を計算
func (ci *CartItem) GetSubtotal() int {
	if ci.Product == nil {
		return 0
	}
	return ci.Product.GetSubtotal(ci.Quantity)
}

// GetWeight アイテムの重量を計算
func (ci *CartItem) GetWeight() float64 {
	if ci.Product == nil {
		return 0
	}
	return ci.Product.Weight * float64(ci.Quantity)
}

// Cart カートエンティティ
type Cart struct {
	ID         string
	CustomerID string
	Items      []*CartItem
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// GetTotalAmount カート合計金額を計算
func (c *Cart) GetTotalAmount() int {
	total := 0
	for _, item := range c.Items {
		total += item.GetSubtotal()
	}
	return total
}

// GetTotalWeight カート合計重量を計算
func (c *Cart) GetTotalWeight() float64 {
	total := 0.0
	for _, item := range c.Items {
		total += item.GetWeight()
	}
	return total
}

// GetItemCount カート内商品数を取得
func (c *Cart) GetItemCount() int {
	count := 0
	for _, item := range c.Items {
		count += item.Quantity
	}
	return count
}

// IsEmpty カートが空かどうか
func (c *Cart) IsEmpty() bool {
	return len(c.Items) == 0
}

// HasCouponApplicableItems クーポン適用可能な商品が含まれているかどうか
func (c *Cart) HasCouponApplicableItems() bool {
	for _, item := range c.Items {
		if item.Product != nil && item.Product.IsCouponApplicable() {
			return true
		}
	}
	return false
}

// GetCouponApplicableAmount クーポン適用可能金額を取得
func (c *Cart) GetCouponApplicableAmount() int {
	total := 0
	for _, item := range c.Items {
		if item.Product != nil && item.Product.IsCouponApplicable() {
			total += item.GetSubtotal()
		}
	}
	return total
}
