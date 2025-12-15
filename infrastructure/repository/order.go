package repository

import (
	"context"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// IOrderRepository 注文リポジトリインターフェース
type IOrderRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Order, error)
	GetByCustomerID(ctx context.Context, customerID string) ([]*entity.Order, error)
	Create(ctx context.Context, order *entity.Order) error
	Update(ctx context.Context, order *entity.Order) error
}

// OrderRepository 注文リポジトリ（モック実装）
type OrderRepository struct {
	mu     sync.RWMutex
	orders map[string]*entity.Order
}

// NewOrderRepository コンストラクタ
func NewOrderRepository() *OrderRepository {
	return &OrderRepository{
		orders: make(map[string]*entity.Order),
	}
}

// GetByID 注文IDで取得
func (r *OrderRepository) GetByID(ctx context.Context, id string) (*entity.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	order, exists := r.orders[id]
	if !exists {
		return nil, &entity.NotFoundError{Resource: "Order", ID: id}
	}
	return order, nil
}

// GetByCustomerID 顧客IDで注文一覧を取得
func (r *OrderRepository) GetByCustomerID(ctx context.Context, customerID string) ([]*entity.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var orders []*entity.Order
	for _, order := range r.orders {
		if order.CustomerID == customerID {
			orders = append(orders, order)
		}
	}
	return orders, nil
}

// Create 注文を作成
func (r *OrderRepository) Create(ctx context.Context, order *entity.Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if order.ID == "" {
		order.ID = uuid.New().String()
	}
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	r.orders[order.ID] = order
	return nil
}

// Update 注文を更新
func (r *OrderRepository) Update(ctx context.Context, order *entity.Order) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.orders[order.ID]; !exists {
		return &entity.NotFoundError{Resource: "Order", ID: order.ID}
	}

	order.UpdatedAt = time.Now()
	r.orders[order.ID] = order
	return nil
}
