package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
	"github.com/shibuya-mizuho/logic-mermaid-pages/infrastructure/repository"
)

// IPaymentService 決済サービスインターフェース
type IPaymentService interface {
	ProcessPayment(ctx context.Context, pricing *entity.Pricing, method entity.PaymentMethod, pointsToUse int, customer *entity.Customer) (*entity.Payment, error)
	RefundPayment(ctx context.Context, payment *entity.Payment, customer *entity.Customer) error
	ValidatePaymentMethod(method entity.PaymentMethod, customer *entity.Customer, pointsToUse int) error
}

// PaymentService 決済サービス
type PaymentService struct {
	customerRepo repository.ICustomerRepository
}

// NewPaymentService コンストラクタ
func NewPaymentService(customerRepo repository.ICustomerRepository) *PaymentService {
	return &PaymentService{
		customerRepo: customerRepo,
	}
}

// ProcessPayment 決済を処理
func (s *PaymentService) ProcessPayment(ctx context.Context, pricing *entity.Pricing, method entity.PaymentMethod, pointsToUse int, customer *entity.Customer) (*entity.Payment, error) {
	// 決済方法のバリデーション
	if err := s.ValidatePaymentMethod(method, customer, pointsToUse); err != nil {
		return nil, err
	}

	payment := &entity.Payment{
		ID:          uuid.New().String(),
		Method:      method,
		Amount:      pricing.TotalAmount,
		Status:      entity.PaymentStatusPending,
		ProcessedAt: time.Now(),
	}

	// 決済方法に応じた処理
	switch method {
	case entity.PaymentMethodCreditCard:
		// クレジットカード決済処理（モック）
		if err := s.processCreditCardPayment(ctx, payment); err != nil {
			return nil, err
		}

	case entity.PaymentMethodBankTransfer:
		// 銀行振込処理（モック）
		if err := s.processBankTransferPayment(ctx, payment); err != nil {
			return nil, err
		}

	case entity.PaymentMethodPoints:
		// ポイント全額決済
		if err := s.processPointsPayment(ctx, payment, customer, pricing.TotalAmount); err != nil {
			return nil, err
		}

	case entity.PaymentMethodCombined:
		// ポイント併用決済
		if err := s.processCombinedPayment(ctx, payment, customer, pointsToUse); err != nil {
			return nil, err
		}
	}

	return payment, nil
}

// ValidatePaymentMethod 決済方法を検証
func (s *PaymentService) ValidatePaymentMethod(method entity.PaymentMethod, customer *entity.Customer, pointsToUse int) error {
	switch method {
	case entity.PaymentMethodPoints:
		// ポイント全額決済の場合、ポイント残高を確認
		if customer == nil {
			return &entity.PaymentError{
				Reason: "顧客情報が必要です",
				Code:   "CUSTOMER_REQUIRED",
			}
		}
		if pointsToUse <= 0 {
			return &entity.PaymentError{
				Reason: "使用ポイントを指定してください",
				Code:   "POINTS_REQUIRED",
			}
		}

	case entity.PaymentMethodCombined:
		// ポイント併用決済の場合
		if customer == nil {
			return &entity.PaymentError{
				Reason: "顧客情報が必要です",
				Code:   "CUSTOMER_REQUIRED",
			}
		}
		if pointsToUse <= 0 {
			return &entity.PaymentError{
				Reason: "使用ポイントを指定してください",
				Code:   "POINTS_REQUIRED",
			}
		}
		if !customer.CanUsePoints(pointsToUse) {
			return &entity.InsufficientPointsError{
				CustomerID: customer.ID,
				Requested:  pointsToUse,
				Available:  customer.PointBalance,
			}
		}

	case entity.PaymentMethodCreditCard, entity.PaymentMethodBankTransfer:
		// 特に追加バリデーションなし
	}

	return nil
}

// RefundPayment 返金処理
func (s *PaymentService) RefundPayment(ctx context.Context, payment *entity.Payment, customer *entity.Customer) error {
	if !payment.CanRefund() {
		return &entity.RefundError{
			OrderID: payment.OrderID,
			Reason:  "この決済は返金できません",
		}
	}

	// 返金処理（モック）
	payment.RefundAmount = payment.Amount
	payment.RefundedAt = time.Now()
	payment.Status = entity.PaymentStatusRefunded

	// ポイントを使用していた場合は返還
	if payment.IsPointsPayment() && payment.PointsUsed > 0 && customer != nil {
		payment.RefundPointsReturn = payment.PointsUsed
		newBalance := customer.PointBalance + payment.PointsUsed
		if err := s.customerRepo.UpdatePointBalance(ctx, customer.ID, newBalance); err != nil {
			return &entity.RefundError{
				OrderID: payment.OrderID,
				Reason:  "ポイント返還に失敗しました",
			}
		}
	}

	return nil
}

// processCreditCardPayment クレジットカード決済処理（モック）
func (s *PaymentService) processCreditCardPayment(ctx context.Context, payment *entity.Payment) error {
	// 実際の決済処理をシミュレート
	payment.TransactionID = "CC-" + uuid.New().String()
	payment.Status = entity.PaymentStatusCompleted
	return nil
}

// processBankTransferPayment 銀行振込処理（モック）
func (s *PaymentService) processBankTransferPayment(ctx context.Context, payment *entity.Payment) error {
	// 銀行振込は入金待ち状態
	payment.TransactionID = "BT-" + uuid.New().String()
	payment.Status = entity.PaymentStatusPending
	return nil
}

// processPointsPayment ポイント全額決済処理
func (s *PaymentService) processPointsPayment(ctx context.Context, payment *entity.Payment, customer *entity.Customer, amount int) error {
	if !customer.CanUsePoints(amount) {
		return &entity.InsufficientPointsError{
			CustomerID: customer.ID,
			Requested:  amount,
			Available:  customer.PointBalance,
		}
	}

	// ポイントを消費
	newBalance := customer.PointBalance - amount
	if err := s.customerRepo.UpdatePointBalance(ctx, customer.ID, newBalance); err != nil {
		return &entity.PaymentError{
			Reason: "ポイント消費に失敗しました",
			Code:   "POINTS_DEDUCTION_FAILED",
		}
	}

	payment.PointsUsed = amount
	payment.CashAmount = 0
	payment.TransactionID = "PT-" + uuid.New().String()
	payment.Status = entity.PaymentStatusCompleted
	return nil
}

// processCombinedPayment ポイント併用決済処理
func (s *PaymentService) processCombinedPayment(ctx context.Context, payment *entity.Payment, customer *entity.Customer, pointsToUse int) error {
	if !customer.CanUsePoints(pointsToUse) {
		return &entity.InsufficientPointsError{
			CustomerID: customer.ID,
			Requested:  pointsToUse,
			Available:  customer.PointBalance,
		}
	}

	// ポイントを消費
	newBalance := customer.PointBalance - pointsToUse
	if err := s.customerRepo.UpdatePointBalance(ctx, customer.ID, newBalance); err != nil {
		return &entity.PaymentError{
			Reason: "ポイント消費に失敗しました",
			Code:   "POINTS_DEDUCTION_FAILED",
		}
	}

	// 残額をクレジットカードで決済
	cashAmount := payment.Amount - pointsToUse
	if cashAmount < 0 {
		cashAmount = 0
	}

	payment.PointsUsed = pointsToUse
	payment.CashAmount = cashAmount
	payment.TransactionID = "CB-" + uuid.New().String()
	payment.Status = entity.PaymentStatusCompleted
	return nil
}
