package repository

import (
	"context"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// IProductRepository 商品リポジトリインターフェース
type IProductRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Product, error)
	GetByIDs(ctx context.Context, ids []string) ([]*entity.Product, error)
}

// ProductRepository 商品リポジトリ（モック実装）
type ProductRepository struct {
	products map[string]*entity.Product
}

// NewProductRepository コンストラクタ
func NewProductRepository() *ProductRepository {
	return &ProductRepository{
		products: map[string]*entity.Product{
			"prod-001": {
				ID:          "prod-001",
				Name:        "ワイヤレスイヤホン",
				Description: "高音質Bluetoothイヤホン",
				Price:       12000,
				Category:    entity.ProductCategoryElectronics,
				Stock:       50,
				IsAvailable: true,
				Weight:      0.1,
			},
			"prod-002": {
				ID:          "prod-002",
				Name:        "コットンTシャツ",
				Description: "100%オーガニックコットン",
				Price:       3500,
				Category:    entity.ProductCategoryClothing,
				Stock:       100,
				IsAvailable: true,
				Weight:      0.3,
			},
			"prod-003": {
				ID:          "prod-003",
				Name:        "プログラミング入門書",
				Description: "初心者向けプログラミング解説書",
				Price:       2800,
				Category:    entity.ProductCategoryBooks,
				Stock:       30,
				IsAvailable: true,
				Weight:      0.5,
			},
			"prod-004": {
				ID:          "prod-004",
				Name:        "オーガニックコーヒー豆",
				Description: "フェアトレードコーヒー 500g",
				Price:       1500,
				Category:    entity.ProductCategoryFood,
				Stock:       200,
				IsAvailable: true,
				Weight:      0.5,
			},
			"prod-005": {
				ID:          "prod-005",
				Name:        "スマートウォッチ",
				Description: "多機能スマートウォッチ",
				Price:       25000,
				Category:    entity.ProductCategoryElectronics,
				Stock:       0,
				IsAvailable: false,
				Weight:      0.15,
			},
		},
	}
}

// GetByID 商品IDで取得
func (r *ProductRepository) GetByID(ctx context.Context, id string) (*entity.Product, error) {
	product, exists := r.products[id]
	if !exists {
		return nil, &entity.NotFoundError{Resource: "Product", ID: id}
	}
	return product, nil
}

// GetByIDs 複数の商品IDで取得
func (r *ProductRepository) GetByIDs(ctx context.Context, ids []string) ([]*entity.Product, error) {
	products := make([]*entity.Product, 0, len(ids))
	for _, id := range ids {
		product, exists := r.products[id]
		if !exists {
			return nil, &entity.NotFoundError{Resource: "Product", ID: id}
		}
		products = append(products, product)
	}
	return products, nil
}
