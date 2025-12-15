package service

import (
	"context"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// ICartService カートサービスインターフェース
type ICartService interface {
	GetCart(ctx context.Context, cartID string) (*entity.Cart, error)
	GetCartByCustomer(ctx context.Context, customerID string) (*entity.Cart, error)
	ValidateCartItems(ctx context.Context, cart *entity.Cart) error
	ClearCart(ctx context.Context, cartID string) error
}

// CartService カートサービス
type CartService struct {
	cartRepo      repository.ICartRepository
	inventoryRepo repository.IInventoryRepository
}

// NewCartService コンストラクタ
func NewCartService(
	cartRepo repository.ICartRepository,
	inventoryRepo repository.IInventoryRepository,
) *CartService {
	return &CartService{
		cartRepo:      cartRepo,
		inventoryRepo: inventoryRepo,
	}
}

// GetCart カートIDでカートを取得
func (s *CartService) GetCart(ctx context.Context, cartID string) (*entity.Cart, error) {
	cart, err := s.cartRepo.GetByID(ctx, cartID)
	if err != nil {
		return nil, err
	}

	// カートが空の場合はエラー
	if cart.IsEmpty() {
		return nil, &entity.ValidationError{
			Field:   "cart",
			Message: "カートが空です",
		}
	}

	return cart, nil
}

// GetCartByCustomer 顧客IDでカートを取得
func (s *CartService) GetCartByCustomer(ctx context.Context, customerID string) (*entity.Cart, error) {
	cart, err := s.cartRepo.GetByCustomerID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	if cart.IsEmpty() {
		return nil, &entity.ValidationError{
			Field:   "cart",
			Message: "カートが空です",
		}
	}

	return cart, nil
}

// ValidateCartItems カートアイテムの有効性を検証
func (s *CartService) ValidateCartItems(ctx context.Context, cart *entity.Cart) error {
	for _, item := range cart.Items {
		// 商品が利用可能かチェック
		if item.Product == nil {
			return &entity.ValidationError{
				Field:   "cart_item",
				Message: "商品情報が取得できません",
			}
		}

		if !item.Product.IsAvailable {
			return &entity.ValidationError{
				Field:   "cart_item",
				Message: "商品 " + item.Product.Name + " は現在販売停止中です",
			}
		}

		// 在庫確認
		stock, err := s.inventoryRepo.GetStock(ctx, item.ProductID)
		if err != nil {
			return err
		}

		if stock < item.Quantity {
			return &entity.InsufficientStockError{
				ProductID: item.ProductID,
				Requested: item.Quantity,
				Available: stock,
			}
		}
	}

	return nil
}

// ClearCart カートをクリア
func (s *CartService) ClearCart(ctx context.Context, cartID string) error {
	return s.cartRepo.Delete(ctx, cartID)
}
