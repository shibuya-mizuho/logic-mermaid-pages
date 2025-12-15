package entity

import "time"

// CustomerRank 会員ランク
type CustomerRank string

const (
	CustomerRankGeneral CustomerRank = "general"
	CustomerRankSilver  CustomerRank = "silver"
	CustomerRankGold    CustomerRank = "gold"
)

// Customer 顧客エンティティ
type Customer struct {
	ID              string
	Name            string
	Email           string
	Rank            CustomerRank
	PointBalance    int
	RegisteredAt    time.Time
	TotalPurchases  int
	LastPurchasedAt time.Time
}

// IsPremium プレミアム会員かどうか
func (c *Customer) IsPremium() bool {
	return c.Rank == CustomerRankGold || c.Rank == CustomerRankSilver
}

// GetDiscountRate 会員ランクに応じた割引率を返す
func (c *Customer) GetDiscountRate() float64 {
	switch c.Rank {
	case CustomerRankGold:
		return 0.10 // 10%割引
	case CustomerRankSilver:
		return 0.05 // 5%割引
	default:
		return 0.0
	}
}

// CanUsePoints ポイントを使用できるかどうか
func (c *Customer) CanUsePoints(points int) bool {
	return c.PointBalance >= points
}
