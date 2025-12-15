package service

import (
	"context"
	"fmt"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// IInventoryService 在庫サービスインターフェース
type IInventoryService interface {
	CheckAvailability(ctx context.Context, items []*entity.CartItem) error
	ReserveStock(ctx context.Context, items []*entity.CartItem) error
	ReleaseStock(ctx context.Context, items []*entity.CartItem) error
	CommitStock(ctx context.Context, items []*entity.CartItem) error
	RestoreStock(ctx context.Context, items []*entity.CartItem) error
}

// InventoryService 在庫サービス
type InventoryService struct {
	inventoryRepo repository.IInventoryRepository
}

// NewInventoryService コンストラクタ
func NewInventoryService(inventoryRepo repository.IInventoryRepository) *InventoryService {
	return &InventoryService{
		inventoryRepo: inventoryRepo,
	}
}

// CheckAvailability 在庫の利用可能性を確認
func (s *InventoryService) CheckAvailability(ctx context.Context, items []*entity.CartItem) error {
	for _, item := range items {
		stock, err := s.inventoryRepo.GetStock(ctx, item.ProductID)
		if err != nil {
			return fmt.Errorf("在庫確認エラー（商品ID: %s）: %w", item.ProductID, err)
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

// ReserveStock 在庫を予約（引当）
func (s *InventoryService) ReserveStock(ctx context.Context, items []*entity.CartItem) error {
	reservedItems := make([]*entity.CartItem, 0, len(items))

	for _, item := range items {
		err := s.inventoryRepo.Reserve(ctx, item.ProductID, item.Quantity)
		if err != nil {
			// 予約済みの在庫を解放
			for _, reserved := range reservedItems {
				_ = s.inventoryRepo.Release(ctx, reserved.ProductID, reserved.Quantity)
			}
			return fmt.Errorf("在庫予約エラー（商品ID: %s）: %w", item.ProductID, err)
		}
		reservedItems = append(reservedItems, item)
	}

	return nil
}

// ReleaseStock 予約済み在庫を解放
func (s *InventoryService) ReleaseStock(ctx context.Context, items []*entity.CartItem) error {
	var lastErr error
	for _, item := range items {
		err := s.inventoryRepo.Release(ctx, item.ProductID, item.Quantity)
		if err != nil {
			// エラーが発生しても他のアイテムの解放は続ける
			lastErr = fmt.Errorf("在庫解放エラー（商品ID: %s）: %w", item.ProductID, err)
		}
	}
	return lastErr
}

// CommitStock 在庫を確定（実際に減らす）
func (s *InventoryService) CommitStock(ctx context.Context, items []*entity.CartItem) error {
	for _, item := range items {
		err := s.inventoryRepo.Commit(ctx, item.ProductID, item.Quantity)
		if err != nil {
			return fmt.Errorf("在庫確定エラー（商品ID: %s）: %w", item.ProductID, err)
		}
	}
	return nil
}

// RestoreStock 在庫を復元（返金時）
func (s *InventoryService) RestoreStock(ctx context.Context, items []*entity.CartItem) error {
	for _, item := range items {
		// 在庫を戻す（Releaseとは異なり、実在庫を増やす）
		err := s.inventoryRepo.Release(ctx, item.ProductID, item.Quantity)
		if err != nil {
			return fmt.Errorf("在庫復元エラー（商品ID: %s）: %w", item.ProductID, err)
		}
	}
	return nil
}
