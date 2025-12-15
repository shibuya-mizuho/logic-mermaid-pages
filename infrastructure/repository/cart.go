package repository

import (
	"context"
	"time"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// ICartRepository カートリポジトリインターフェース
type ICartRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Cart, error)
	GetByCustomerID(ctx context.Context, customerID string) (*entity.Cart, error)
	Save(ctx context.Context, cart *entity.Cart) error
	Delete(ctx context.Context, id string) error
}

// CartRepository カートリポジトリ（モック実装）
type CartRepository struct {
	carts       map[string]*entity.Cart
	productRepo IProductRepository
}

// NewCartRepository コンストラクタ
func NewCartRepository(productRepo IProductRepository) *CartRepository {
	now := time.Now()
	return &CartRepository{
		carts: map[string]*entity.Cart{
			"cart-001": {
				ID:         "cart-001",
				CustomerID: "cust-001",
				Items: []*entity.CartItem{
					{ProductID: "prod-001", Quantity: 2, AddedAt: now},
					{ProductID: "prod-002", Quantity: 1, AddedAt: now},
				},
				CreatedAt: now,
				UpdatedAt: now,
			},
			"cart-002": {
				ID:         "cart-002",
				CustomerID: "cust-002",
				Items: []*entity.CartItem{
					{ProductID: "prod-003", Quantity: 1, AddedAt: now},
					{ProductID: "prod-004", Quantity: 3, AddedAt: now},
				},
				CreatedAt: now,
				UpdatedAt: now,
			},
			"cart-003": {
				ID:         "cart-003",
				CustomerID: "cust-003",
				Items: []*entity.CartItem{
					{ProductID: "prod-001", Quantity: 1, AddedAt: now},
					{ProductID: "prod-002", Quantity: 2, AddedAt: now},
					{ProductID: "prod-003", Quantity: 1, AddedAt: now},
				},
				CreatedAt: now,
				UpdatedAt: now,
			},
		},
		productRepo: productRepo,
	}
}

// GetByID カートIDで取得
func (r *CartRepository) GetByID(ctx context.Context, id string) (*entity.Cart, error) {
	cart, exists := r.carts[id]
	if !exists {
		return nil, &entity.NotFoundError{Resource: "Cart", ID: id}
	}

	// 商品情報を付与
	if err := r.populateProducts(ctx, cart); err != nil {
		return nil, err
	}

	return cart, nil
}

// GetByCustomerID 顧客IDでカートを取得
func (r *CartRepository) GetByCustomerID(ctx context.Context, customerID string) (*entity.Cart, error) {
	for _, cart := range r.carts {
		if cart.CustomerID == customerID {
			if err := r.populateProducts(ctx, cart); err != nil {
				return nil, err
			}
			return cart, nil
		}
	}
	return nil, &entity.NotFoundError{Resource: "Cart", ID: customerID}
}

// Save カートを保存
func (r *CartRepository) Save(ctx context.Context, cart *entity.Cart) error {
	r.carts[cart.ID] = cart
	return nil
}

// Delete カートを削除
func (r *CartRepository) Delete(ctx context.Context, id string) error {
	if _, exists := r.carts[id]; !exists {
		return &entity.NotFoundError{Resource: "Cart", ID: id}
	}
	delete(r.carts, id)
	return nil
}

// populateProducts カートアイテムに商品情報を付与
func (r *CartRepository) populateProducts(ctx context.Context, cart *entity.Cart) error {
	for _, item := range cart.Items {
		product, err := r.productRepo.GetByID(ctx, item.ProductID)
		if err != nil {
			return err
		}
		item.Product = product
	}
	return nil
}
