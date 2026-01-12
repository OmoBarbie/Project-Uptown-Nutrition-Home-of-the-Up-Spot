import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);

        // Find the order by payment intent ID
        const [order] = await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.paymentIntentId, paymentIntent.id))
          .limit(1);

        if (!order) {
          console.error('Order not found for payment intent:', paymentIntent.id);
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }

        // Update order status to confirmed and payment succeeded
        await db
          .update(schema.orders)
          .set({
            status: 'confirmed',
            paymentStatus: 'succeeded',
            confirmedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.orders.id, order.id));

        console.log('Order confirmed:', order.orderNumber);

        // TODO: Send order confirmation email
        // await sendOrderConfirmationEmail(order);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);

        // Find the order
        const [order] = await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.paymentIntentId, paymentIntent.id))
          .limit(1);

        if (order) {
          // Update order to failed
          await db
            .update(schema.orders)
            .set({
              paymentStatus: 'failed',
              updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, order.id));

          console.log('Order payment failed:', order.orderNumber);
        }

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment canceled:', paymentIntent.id);

        // Find the order
        const [order] = await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.paymentIntentId, paymentIntent.id))
          .limit(1);

        if (order) {
          // Update order to cancelled
          await db
            .update(schema.orders)
            .set({
              status: 'cancelled',
              paymentStatus: 'failed',
              cancelledAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, order.id));

          console.log('Order cancelled:', order.orderNumber);
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        console.log('Charge refunded:', charge.id);

        if (paymentIntentId) {
          // Find the order
          const [order] = await db
            .select()
            .from(schema.orders)
            .where(eq(schema.orders.paymentIntentId, paymentIntentId))
            .limit(1);

          if (order) {
            // Update order to refunded
            await db
              .update(schema.orders)
              .set({
                status: 'refunded',
                paymentStatus: 'refunded',
                updatedAt: new Date(),
              })
              .where(eq(schema.orders.id, order.id));

            console.log('Order refunded:', order.orderNumber);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
