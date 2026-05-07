'use server';

import Stripe from 'stripe';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';
import { sendRefundNotification } from '@tayo/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function refundOrder(
  orderId: string,
  reason: 'duplicate' | 'fraudulent' | 'customer_request' | 'other'
) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error('Unauthorized');

  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
  if (!order) throw new Error('Order not found');
  if (order.paymentStatus !== 'succeeded') throw new Error('Order is not eligible for refund');
  if (!order.paymentIntentId) throw new Error('No payment intent found');

  await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    reason: reason === 'customer_request' || reason === 'other'
      ? undefined
      : (reason as Stripe.RefundCreateParams.Reason),
  });

  await db.update(schema.orders)
    .set({ paymentStatus: 'refunded', status: 'refunded', updatedAt: new Date() })
    .where(eq(schema.orders.id, orderId));

  await createAuditLog(session.user.id, {
    action: 'update',
    entityType: 'order',
    entityId: orderId,
    changes: { after: { status: 'refunded', paymentStatus: 'refunded', refundReason: reason } },
  });

  if (order.customerEmail) {
    await sendRefundNotification(order.customerEmail, order.orderNumber, order.total, reason);
  }

  revalidatePath(`/orders/${orderId}`);
}
