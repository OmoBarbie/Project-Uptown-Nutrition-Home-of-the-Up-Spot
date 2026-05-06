import { getResend, FROM } from './index';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { VerifyEmailTemplate } from './templates/verify-email';
import { ResetPasswordTemplate } from './templates/reset-password';
import { OrderStatusUpdateEmail } from './templates/order-status-update';
import { RefundNotificationEmail } from './templates/refund-notification';

export async function sendVerifyEmail(to: string, url: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Verify your Tayo account',
    react: VerifyEmailTemplate({ url }),
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Reset your Tayo password',
    react: ResetPasswordTemplate({ url }),
  });
}

export async function sendOrderConfirmation(to: string, order: {
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: string }[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Order confirmed — #${order.orderNumber}`,
    react: OrderConfirmationEmail(order),
  });
}

export async function sendOrderStatusUpdate(to: string, orderNumber: string, status: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Your order #${orderNumber} has been ${status}`,
    react: OrderStatusUpdateEmail({ orderNumber, status }),
  });
}

export async function sendRefundNotification(to: string, orderNumber: string, amount: string, reason: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Refund processed for order #${orderNumber}`,
    react: RefundNotificationEmail({ orderNumber, amount, reason }),
  });
}
