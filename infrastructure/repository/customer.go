package repository

import (
	"context"
	"time"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// ICustomerRepository 顧客リポジトリインターフェース
type ICustomerRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Customer, error)
	UpdatePointBalance(ctx context.Context, customerID string, points int) error
}

// CustomerRepository 顧客リポジトリ（モック実装）
type CustomerRepository struct {
	customers map[string]*entity.Customer
}

// NewCustomerRepository コンストラクタ
func NewCustomerRepository() *CustomerRepository {
	return &CustomerRepository{
		customers: map[string]*entity.Customer{
			"cust-001": {
				ID:              "cust-001",
				Name:            "山田太郎",
				Email:           "yamada@example.com",
				Rank:            entity.CustomerRankGold,
				PointBalance:    5000,
				RegisteredAt:    time.Now().AddDate(-2, 0, 0),
				TotalPurchases:  150000,
				LastPurchasedAt: time.Now().AddDate(0, -1, 0),
			},
			"cust-002": {
				ID:              "cust-002",
				Name:            "鈴木花子",
				Email:           "suzuki@example.com",
				Rank:            entity.CustomerRankSilver,
				PointBalance:    2000,
				RegisteredAt:    time.Now().AddDate(-1, 0, 0),
				TotalPurchases:  50000,
				LastPurchasedAt: time.Now().AddDate(0, -2, 0),
			},
			"cust-003": {
				ID:              "cust-003",
				Name:            "佐藤次郎",
				Email:           "sato@example.com",
				Rank:            entity.CustomerRankGeneral,
				PointBalance:    500,
				RegisteredAt:    time.Now().AddDate(0, -3, 0),
				TotalPurchases:  10000,
				LastPurchasedAt: time.Now().AddDate(0, 0, -7),
			},
		},
	}
}

// GetByID 顧客IDで取得
func (r *CustomerRepository) GetByID(ctx context.Context, id string) (*entity.Customer, error) {
	customer, exists := r.customers[id]
	if !exists {
		return nil, &entity.NotFoundError{Resource: "Customer", ID: id}
	}
	return customer, nil
}

// UpdatePointBalance ポイント残高を更新
func (r *CustomerRepository) UpdatePointBalance(ctx context.Context, customerID string, points int) error {
	customer, exists := r.customers[customerID]
	if !exists {
		return &entity.NotFoundError{Resource: "Customer", ID: customerID}
	}
	customer.PointBalance = points
	return nil
}
