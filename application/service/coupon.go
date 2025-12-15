package service

import (
	"context"
	"math"
	"slices"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// ICouponService クーポンサービスインターフェース
type ICouponService interface {
	ValidateCoupon(ctx context.Context, code string, cart *entity.Cart, customer *entity.Customer) (*repository.Coupon, error)
	ApplyCoupon(ctx context.Context, coupon *repository.Coupon, pricing *entity.Pricing, cart *entity.Cart) error
	UseCoupon(ctx context.Context, code string) error
}

// CouponService クーポンサービス
type CouponService struct {
	couponRepo repository.ICouponRepository
}

// NewCouponService コンストラクタ
func NewCouponService(couponRepo repository.ICouponRepository) *CouponService {
	return &CouponService{
		couponRepo: couponRepo,
	}
}

// ValidateCoupon クーポンを検証
func (s *CouponService) ValidateCoupon(ctx context.Context, code string, cart *entity.Cart, customer *entity.Customer) (*repository.Coupon, error) {
	// クーポンを取得
	coupon, err := s.couponRepo.GetByCode(ctx, code)
	if err != nil {
		return nil, &entity.CouponError{
			Code:   code,
			Reason: "クーポンが見つかりません",
		}
	}

	// クーポンの有効性をチェック
	if !coupon.IsValid() {
		return nil, &entity.CouponError{
			Code:   code,
			Reason: "クーポンが無効または期限切れです",
		}
	}

	// 最低購入金額をチェック
	cartTotal := cart.GetTotalAmount()
	if cartTotal < coupon.MinPurchaseAmount {
		return nil, &entity.CouponError{
			Code:   code,
			Reason: "最低購入金額に達していません",
		}
	}

	// 対象カテゴリをチェック
	if len(coupon.TargetCategories) > 0 {
		hasApplicableItem := false
		for _, item := range cart.Items {
			if item.Product != nil && slices.Contains(coupon.TargetCategories, item.Product.Category) {
				hasApplicableItem = true
				break
			}
		}
		if !hasApplicableItem {
			return nil, &entity.CouponError{
				Code:   code,
				Reason: "対象商品がカートに含まれていません",
			}
		}
	}

	return coupon, nil
}

// ApplyCoupon クーポンを適用
func (s *CouponService) ApplyCoupon(ctx context.Context, coupon *repository.Coupon, pricing *entity.Pricing, cart *entity.Cart) error {
	if coupon == nil {
		return nil
	}

	// 割引対象金額を計算
	applicableAmount := s.calculateApplicableAmount(cart, coupon)

	var discountAmount int

	switch coupon.Type {
	case repository.CouponTypePercentage:
		// パーセンテージ割引
		discountAmount = int(math.Floor(float64(applicableAmount) * float64(coupon.Value) / 100))
		// 最大割引額を適用
		if coupon.MaxDiscountAmount > 0 && discountAmount > coupon.MaxDiscountAmount {
			discountAmount = coupon.MaxDiscountAmount
		}
	case repository.CouponTypeFixed:
		// 固定額割引
		discountAmount = coupon.Value
		// 割引額が対象金額を超えないようにする
		if discountAmount > applicableAmount {
			discountAmount = applicableAmount
		}
	}

	pricing.CouponDiscount = discountAmount
	pricing.AppliedCouponCode = coupon.Code

	// 合計金額を再計算
	netAmount := pricing.SubTotal - pricing.MemberDiscount - pricing.CouponDiscount
	if netAmount < 0 {
		netAmount = 0
	}

	// 税金を再計算
	taxRate := pricing.TaxRate
	if taxRate == 0 {
		taxRate = TaxRate
	}
	pricing.Tax = int(math.Floor(float64(netAmount) * taxRate))

	// 合計金額を更新
	pricing.TotalAmount = netAmount + pricing.Tax + pricing.ShippingFee

	return nil
}

// UseCoupon クーポンを使用済みにする
func (s *CouponService) UseCoupon(ctx context.Context, code string) error {
	return s.couponRepo.IncrementUsage(ctx, code)
}

// calculateApplicableAmount 割引対象金額を計算
func (s *CouponService) calculateApplicableAmount(cart *entity.Cart, coupon *repository.Coupon) int {
	// 対象カテゴリが指定されていない場合は全額対象
	if len(coupon.TargetCategories) == 0 {
		return cart.GetTotalAmount()
	}

	// 対象カテゴリの商品のみの金額を計算
	total := 0
	for _, item := range cart.Items {
		if item.Product != nil && slices.Contains(coupon.TargetCategories, item.Product.Category) {
			total += item.GetSubtotal()
		}
	}

	return total
}
