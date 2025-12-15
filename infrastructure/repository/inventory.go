package repository

import (
	"context"
	"sync"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// IInventoryRepository 在庫リポジトリインターフェース
type IInventoryRepository interface {
	GetStock(ctx context.Context, productID string) (int, error)
	Reserve(ctx context.Context, productID string, quantity int) error
	Release(ctx context.Context, productID string, quantity int) error
	Commit(ctx context.Context, productID string, quantity int) error
}

// InventoryRepository 在庫リポジトリ（モック実装）
type InventoryRepository struct {
	mu       sync.RWMutex
	stock    map[string]int // 実在庫
	reserved map[string]int // 予約済み在庫
}

// NewInventoryRepository コンストラクタ
func NewInventoryRepository() *InventoryRepository {
	return &InventoryRepository{
		stock: map[string]int{
			"prod-001": 50,
			"prod-002": 100,
			"prod-003": 30,
			"prod-004": 200,
			"prod-005": 0,
		},
		reserved: make(map[string]int),
	}
}

// GetStock 在庫数を取得
func (r *InventoryRepository) GetStock(ctx context.Context, productID string) (int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	stock, exists := r.stock[productID]
	if !exists {
		return 0, &entity.NotFoundError{Resource: "Inventory", ID: productID}
	}
	return stock - r.reserved[productID], nil
}

// Reserve 在庫を予約（引当）
func (r *InventoryRepository) Reserve(ctx context.Context, productID string, quantity int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	stock, exists := r.stock[productID]
	if !exists {
		return &entity.NotFoundError{Resource: "Inventory", ID: productID}
	}

	available := stock - r.reserved[productID]
	if available < quantity {
		return &entity.InsufficientStockError{
			ProductID: productID,
			Requested: quantity,
			Available: available,
		}
	}

	r.reserved[productID] += quantity
	return nil
}

// Release 予約済み在庫を解放
func (r *InventoryRepository) Release(ctx context.Context, productID string, quantity int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.reserved[productID] < quantity {
		// 解放量が予約量より多い場合は予約量を0にする
		r.reserved[productID] = 0
		return nil
	}

	r.reserved[productID] -= quantity
	return nil
}

// Commit 在庫を確定（実際に減らす）
func (r *InventoryRepository) Commit(ctx context.Context, productID string, quantity int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	stock, exists := r.stock[productID]
	if !exists {
		return &entity.NotFoundError{Resource: "Inventory", ID: productID}
	}

	if stock < quantity {
		return &entity.InsufficientStockError{
			ProductID: productID,
			Requested: quantity,
			Available: stock,
		}
	}

	r.stock[productID] -= quantity
	if r.reserved[productID] >= quantity {
		r.reserved[productID] -= quantity
	} else {
		r.reserved[productID] = 0
	}

	return nil
}
