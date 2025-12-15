package entity

// ProductCategory 商品カテゴリ
type ProductCategory string

const (
	ProductCategoryElectronics ProductCategory = "electronics"
	ProductCategoryClothing    ProductCategory = "clothing"
	ProductCategoryFood        ProductCategory = "food"
	ProductCategoryBooks       ProductCategory = "books"
)

// Product 商品エンティティ
type Product struct {
	ID          string
	Name        string
	Description string
	Price       int
	Category    ProductCategory
	Stock       int
	IsAvailable bool
	Weight      float64 // 配送料計算用（kg）
}

// CanPurchase 購入可能かどうか
func (p *Product) CanPurchase(quantity int) bool {
	return p.IsAvailable && p.Stock >= quantity
}

// IsCouponApplicable クーポン適用可能なカテゴリかどうか
func (p *Product) IsCouponApplicable() bool {
	// 食品カテゴリはクーポン適用対象外
	return p.Category != ProductCategoryFood
}

// GetSubtotal 小計を計算
func (p *Product) GetSubtotal(quantity int) int {
	return p.Price * quantity
}
