package repository

import (
	"context"
	"time"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// CouponType クーポンタイプ
type CouponType string

const (
	CouponTypePercentage CouponType = "percentage" // 割引率
	CouponTypeFixed      CouponType = "fixed"      // 固定額割引
)

// Coupon クーポンエンティティ
type Coupon struct {
	Code              string
	Type              CouponType
	Value             int // 割引率（%）または固定額（円）
	MinPurchaseAmount int // 最低購入金額
	MaxDiscountAmount int // 最大割引額（割引率の場合）
	ValidFrom         time.Time
	ValidUntil        time.Time
	UsageLimit        int // 使用回数上限
	UsedCount         int // 使用済み回数
	IsActive          bool
	TargetCategories  []entity.ProductCategory // 対象カテゴリ（空の場合は全カテゴリ）
}

// IsValid クーポンが有効かどうか
func (c *Coupon) IsValid() bool {
	now := time.Now()
	return c.IsActive &&
		now.After(c.ValidFrom) &&
		now.Before(c.ValidUntil) &&
		(c.UsageLimit == 0 || c.UsedCount < c.UsageLimit)
}

// ICouponRepository クーポンリポジトリインターフェース
type ICouponRepository interface {
	GetByCode(ctx context.Context, code string) (*Coupon, error)
	IncrementUsage(ctx context.Context, code string) error
}

// CouponRepository クーポンリポジトリ（モック実装）
type CouponRepository struct {
	coupons map[string]*Coupon
}

// NewCouponRepository コンストラクタ
func NewCouponRepository() *CouponRepository {
	now := time.Now()
	return &CouponRepository{
		coupons: map[string]*Coupon{
			"WELCOME10": {
				Code:              "WELCOME10",
				Type:              CouponTypePercentage,
				Value:             10,
				MinPurchaseAmount: 3000,
				MaxDiscountAmount: 1000,
				ValidFrom:         now.AddDate(0, -1, 0),
				ValidUntil:        now.AddDate(0, 1, 0),
				UsageLimit:        100,
				UsedCount:         50,
				IsActive:          true,
				TargetCategories:  nil, // 全カテゴリ対象
			},
			"SAVE500": {
				Code:              "SAVE500",
				Type:              CouponTypeFixed,
				Value:             500,
				MinPurchaseAmount: 5000,
				MaxDiscountAmount: 500,
				ValidFrom:         now.AddDate(0, -1, 0),
				ValidUntil:        now.AddDate(0, 1, 0),
				UsageLimit:        0, // 無制限
				UsedCount:         200,
				IsActive:          true,
				TargetCategories:  nil,
			},
			"ELECTRONICS20": {
				Code:              "ELECTRONICS20",
				Type:              CouponTypePercentage,
				Value:             20,
				MinPurchaseAmount: 10000,
				MaxDiscountAmount: 5000,
				ValidFrom:         now.AddDate(0, -1, 0),
				ValidUntil:        now.AddDate(0, 1, 0),
				UsageLimit:        50,
				UsedCount:         30,
				IsActive:          true,
				TargetCategories:  []entity.ProductCategory{entity.ProductCategoryElectronics},
			},
			"EXPIRED": {
				Code:              "EXPIRED",
				Type:              CouponTypePercentage,
				Value:             50,
				MinPurchaseAmount: 1000,
				MaxDiscountAmount: 10000,
				ValidFrom:         now.AddDate(-1, 0, 0),
				ValidUntil:        now.AddDate(0, -1, 0), // 期限切れ
				UsageLimit:        100,
				UsedCount:         10,
				IsActive:          true,
				TargetCategories:  nil,
			},
		},
	}
}

// GetByCode クーポンコードで取得
func (r *CouponRepository) GetByCode(ctx context.Context, code string) (*Coupon, error) {
	coupon, exists := r.coupons[code]
	if !exists {
		return nil, &entity.NotFoundError{Resource: "Coupon", ID: code}
	}
	return coupon, nil
}

// IncrementUsage 使用回数をインクリメント
func (r *CouponRepository) IncrementUsage(ctx context.Context, code string) error {
	coupon, exists := r.coupons[code]
	if !exists {
		return &entity.NotFoundError{Resource: "Coupon", ID: code}
	}
	coupon.UsedCount++
	return nil
}
