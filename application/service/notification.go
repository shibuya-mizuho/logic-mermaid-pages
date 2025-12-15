package service

import (
	"context"
	"fmt"
	"log"

	"github.com/shibuya-mizuho/logic-mermaid-pages/domain/entity"
)

// NotificationType 通知タイプ
type NotificationType string

const (
	NotificationTypeOrderConfirmation NotificationType = "order_confirmation"
	NotificationTypeShippingNotice    NotificationType = "shipping_notice"
	NotificationTypeDeliveryComplete  NotificationType = "delivery_complete"
	NotificationTypeRefundComplete    NotificationType = "refund_complete"
)

// INotificationService 通知サービスインターフェース
type INotificationService interface {
	SendOrderConfirmation(ctx context.Context, customer *entity.Customer, order *entity.Order) error
	SendShippingNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error
	SendDeliveryNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error
	SendRefundNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error
}

// NotificationService 通知サービス
type NotificationService struct{}

// NewNotificationService コンストラクタ
func NewNotificationService() *NotificationService {
	return &NotificationService{}
}

// SendOrderConfirmation 注文確認通知を送信
func (s *NotificationService) SendOrderConfirmation(ctx context.Context, customer *entity.Customer, order *entity.Order) error {
	if customer == nil || order == nil {
		return fmt.Errorf("customer and order are required")
	}

	// メール送信（モック）
	subject := fmt.Sprintf("【ご注文確認】注文番号: %s", order.ID)
	body := s.buildOrderConfirmationBody(customer, order)

	return s.sendEmail(ctx, customer.Email, subject, body)
}

// SendShippingNotification 発送通知を送信
func (s *NotificationService) SendShippingNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error {
	if customer == nil || order == nil {
		return fmt.Errorf("customer and order are required")
	}

	subject := fmt.Sprintf("【発送のお知らせ】注文番号: %s", order.ID)
	body := s.buildShippingNotificationBody(customer, order)

	return s.sendEmail(ctx, customer.Email, subject, body)
}

// SendDeliveryNotification 配送完了通知を送信
func (s *NotificationService) SendDeliveryNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error {
	if customer == nil || order == nil {
		return fmt.Errorf("customer and order are required")
	}

	subject := fmt.Sprintf("【配送完了のお知らせ】注文番号: %s", order.ID)
	body := s.buildDeliveryNotificationBody(customer, order)

	return s.sendEmail(ctx, customer.Email, subject, body)
}

// SendRefundNotification 返金完了通知を送信
func (s *NotificationService) SendRefundNotification(ctx context.Context, customer *entity.Customer, order *entity.Order) error {
	if customer == nil || order == nil {
		return fmt.Errorf("customer and order are required")
	}

	subject := fmt.Sprintf("【返金完了のお知らせ】注文番号: %s", order.ID)
	body := s.buildRefundNotificationBody(customer, order)

	return s.sendEmail(ctx, customer.Email, subject, body)
}

// sendEmail メールを送信（モック）
func (s *NotificationService) sendEmail(ctx context.Context, to, subject, body string) error {
	// 実際のメール送信処理をシミュレート
	log.Printf("[EMAIL] To: %s, Subject: %s", to, subject)
	log.Printf("[EMAIL] Body:\n%s", body)
	return nil
}

// buildOrderConfirmationBody 注文確認メール本文を作成
func (s *NotificationService) buildOrderConfirmationBody(customer *entity.Customer, order *entity.Order) string {
	body := fmt.Sprintf(`
%s 様

この度はご注文いただきありがとうございます。

■ 注文情報
注文番号: %s
注文日時: %s

■ ご注文内容
`, customer.Name, order.ID, order.CreatedAt.Format("2006/01/02 15:04"))

	// カートアイテムを追加
	if order.Cart != nil {
		for _, item := range order.Cart.Items {
			if item.Product != nil {
				body += fmt.Sprintf("・%s × %d個 ¥%d\n",
					item.Product.Name, item.Quantity, item.GetSubtotal())
			}
		}
	}

	// 金額情報を追加
	if order.Pricing != nil {
		body += fmt.Sprintf(`
■ 金額
商品小計: ¥%d
割引: -¥%d
消費税: ¥%d
配送料: ¥%d
合計: ¥%d
`,
			order.Pricing.SubTotal,
			order.Pricing.GetDiscountTotal(),
			order.Pricing.Tax,
			order.Pricing.ShippingFee,
			order.Pricing.TotalAmount)
	}

	// 配送情報を追加
	if order.Shipping != nil && order.Shipping.Address != nil {
		body += fmt.Sprintf(`
■ 配送先
%s
〒%s
%s%s%s
`,
			order.Shipping.Address.RecipientName,
			order.Shipping.Address.PostalCode,
			order.Shipping.Address.Prefecture,
			order.Shipping.Address.City,
			order.Shipping.Address.AddressLine1)

		body += fmt.Sprintf("\n配送予定日: %s\n", order.Shipping.EstimatedDate.Format("2006/01/02"))
	}

	return body
}

// buildShippingNotificationBody 発送通知メール本文を作成
func (s *NotificationService) buildShippingNotificationBody(customer *entity.Customer, order *entity.Order) string {
	body := fmt.Sprintf(`
%s 様

ご注文の商品を発送いたしました。

■ 注文番号: %s
`, customer.Name, order.ID)

	if order.Shipping != nil {
		body += fmt.Sprintf(`
■ 配送情報
追跡番号: %s
配送予定日: %s
`, order.Shipping.TrackingNumber, order.Shipping.EstimatedDate.Format("2006/01/02"))
	}

	return body
}

// buildDeliveryNotificationBody 配送完了通知メール本文を作成
func (s *NotificationService) buildDeliveryNotificationBody(customer *entity.Customer, order *entity.Order) string {
	return fmt.Sprintf(`
%s 様

ご注文の商品が配送完了いたしました。

■ 注文番号: %s

商品をお受け取りいただきありがとうございました。
またのご利用をお待ちしております。
`, customer.Name, order.ID)
}

// buildRefundNotificationBody 返金完了通知メール本文を作成
func (s *NotificationService) buildRefundNotificationBody(customer *entity.Customer, order *entity.Order) string {
	body := fmt.Sprintf(`
%s 様

返金処理が完了いたしました。

■ 注文番号: %s
`, customer.Name, order.ID)

	if order.Payment != nil {
		body += fmt.Sprintf(`
■ 返金情報
返金額: ¥%d
`, order.Payment.RefundAmount)

		if order.Payment.RefundPointsReturn > 0 {
			body += fmt.Sprintf("返還ポイント: %dポイント\n", order.Payment.RefundPointsReturn)
		}
	}

	return body
}
