'use server';

import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCart, clearCart } from '@/app/actions/cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export type CheckoutState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
  };
  clientSecret?: string;
  orderId?: string;
};

export async function createPaymentIntent(
  prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  try {
    // Get session
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    // Get form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const street = formData.get('street') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;

    // Get cart items from database
    const dbCartItems = await getCart();

    // Validate
    const errors: CheckoutState['errors'] = {};
    if (!name) errors.name = ['Name is required'];
    if (!email) errors.email = ['Email is required'];
    if (!street) errors.address = ['Address is required'];

    if (dbCartItems.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty. Please add items before checking out.',
      };
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    // Calculate total from database cart items
    const subtotal = dbCartItems.reduce((sum: number, item: any) => {
      const price = parseFloat(item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal >= 50 ? 0 : 5; // Free delivery over $50
    const total = subtotal + tax + deliveryFee;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session?.user.id || 'guest',
        customerName: name,
        customerEmail: email,
      },
    });

    // Create pending order in database
    const db = getDb();
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const [order] = await db.insert(schema.orders).values({
      orderNumber,
      userId: session?.user.id || null,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      paymentIntentId: paymentIntent.id,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || null,
    }).returning();

    // Insert order items from database cart
    await db.insert(schema.orderItems).values(
      dbCartItems.map((item: any) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: (parseFloat(item.product.price) * item.quantity).toFixed(2),
      }))
    );

    // Clear cart after creating order
    await clearCart();

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      orderId: order.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      message: 'Failed to create payment. Please try again.',
    };
  }
}

export async function confirmOrder(orderId: string) {
  try {
    const db = getDb();

    await db
      .update(schema.orders)
      .set({
        status: 'confirmed',
        paymentStatus: 'succeeded',
        confirmedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId));

    redirect(`/orders/${orderId}?success=true`);
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
}
