package service

import (
	"context"
	"math"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

const (
	// 消費税率
	TaxRate = 0.10

	// 配送料の閾値
	FreeShippingThreshold = 5000 // 5000円以上で送料無料
	StandardShippingFee   = 500  // 通常配送料
	ExpressShippingFee    = 1000 // 速達配送料

	// 重量による追加配送料
	HeavyWeightThreshold = 10.0 // 10kg以上で追加料金
	HeavyWeightFee       = 500  // 重量追加料金

	// ポイント還元率
	PointEarnRate        = 0.01 // 通常1%
	PremiumPointEarnRate = 0.03 // プレミアム会員3%
)

// IPricingService 価格計算サービスインターフェース
type IPricingService interface {
	Calculate(ctx context.Context, cart *entity.Cart, customer *entity.Customer, shippingMethod entity.ShippingMethod) (*entity.Pricing, error)
	ApplyMemberDiscount(pricing *entity.Pricing, customer *entity.Customer) error
	CalculateShippingFee(cart *entity.Cart, shippingMethod entity.ShippingMethod) int
	CalculateTax(amount int) int
	CalculatePointsToEarn(totalAmount int, customer *entity.Customer) int
}

// PricingService 価格計算サービス
type PricingService struct{}

// NewPricingService コンストラクタ
func NewPricingService() *PricingService {
	return &PricingService{}
}

// Calculate 価格を計算
func (s *PricingService) Calculate(ctx context.Context, cart *entity.Cart, customer *entity.Customer, shippingMethod entity.ShippingMethod) (*entity.Pricing, error) {
	pricing := &entity.Pricing{
		TaxRate: TaxRate,
	}

	// 商品小計を計算
	pricing.SubTotal = cart.GetTotalAmount()

	// 会員割引を適用
	if err := s.ApplyMemberDiscount(pricing, customer); err != nil {
		return nil, err
	}

	// 配送料を計算
	pricing.ShippingFee = s.CalculateShippingFee(cart, shippingMethod)

	// 税込金額を計算
	netAmount := pricing.SubTotal - pricing.MemberDiscount - pricing.CouponDiscount
	if netAmount < 0 {
		netAmount = 0
	}

	// 配送料は非課税として、商品金額のみに税金を適用
	pricing.Tax = s.CalculateTax(netAmount)

	// 合計金額を計算
	pricing.TotalAmount = netAmount + pricing.Tax + pricing.ShippingFee

	// 獲得ポイントを計算
	pricing.PointsToEarn = s.CalculatePointsToEarn(pricing.TotalAmount, customer)

	return pricing, nil
}

// ApplyMemberDiscount 会員割引を適用
func (s *PricingService) ApplyMemberDiscount(pricing *entity.Pricing, customer *entity.Customer) error {
	if customer == nil {
		return nil
	}

	// 会員ランクに応じた割引率を取得
	discountRate := customer.GetDiscountRate()
	if discountRate <= 0 {
		return nil
	}

	// 割引額を計算（小数点以下切り捨て）
	discountAmount := int(math.Floor(float64(pricing.SubTotal) * discountRate))
	pricing.MemberDiscount = discountAmount

	return nil
}

// CalculateShippingFee 配送料を計算
func (s *PricingService) CalculateShippingFee(cart *entity.Cart, shippingMethod entity.ShippingMethod) int {
	// 店舗受取は配送料なし
	if shippingMethod == entity.ShippingMethodPickup {
		return 0
	}

	// 一定金額以上で送料無料
	if cart.GetTotalAmount() >= FreeShippingThreshold {
		return 0
	}

	// 基本配送料
	baseFee := StandardShippingFee
	if shippingMethod == entity.ShippingMethodExpress {
		baseFee = ExpressShippingFee
	}

	// 重量による追加料金
	totalWeight := cart.GetTotalWeight()
	if totalWeight >= HeavyWeightThreshold {
		baseFee += HeavyWeightFee
	}

	return baseFee
}

// CalculateTax 消費税を計算
func (s *PricingService) CalculateTax(amount int) int {
	// 税額は切り捨て
	return int(math.Floor(float64(amount) * TaxRate))
}

// CalculatePointsToEarn 獲得予定ポイントを計算
func (s *PricingService) CalculatePointsToEarn(totalAmount int, customer *entity.Customer) int {
	if customer == nil {
		return 0
	}

	// プレミアム会員は還元率アップ
	earnRate := PointEarnRate
	if customer.IsPremium() {
		earnRate = PremiumPointEarnRate
	}

	// ポイントは切り捨て
	return int(math.Floor(float64(totalAmount) * earnRate))
}
