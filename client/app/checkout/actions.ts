'use server'

import { getDb, schema } from '@tayo/database'
import { sendOrderConfirmation } from '@tayo/email'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { clearCart, getCart } from '@/app/actions/cart'
import { auth } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export interface CheckoutState {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
  }
  clientSecret?: string
  orderId?: string
}

export async function createPaymentIntent(
  prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  try {
    // Get session — orders.userId is NOT NULL so authentication is required
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList,
    })

    if (!session) {
      return {
        success: false,
        message: 'Please sign in to complete your purchase.',
      }
    }

    const db = getDb()
    const dbUser = await db.query.users.findFirst({ where: eq(schema.users.id, session.user.id), columns: { isBanned: true } })
    if (dbUser?.isBanned) {
      return { success: false, message: 'Your account has been suspended. Please contact us for assistance.' }
    }

    // Get form data
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const zipCode = formData.get('zipCode') as string

    // Get cart items from database
    const dbCartItems = await getCart()

    // Validate
    const errors: CheckoutState['errors'] = {}
    if (!name)
      errors.name = ['Name is required']
    if (!email)
      errors.email = ['Email is required']
    // if (!street)
    //   errors.address = ['Address is required']

    if (dbCartItems.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty. Please add items before checking out.',
      }
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    // Calculate total from database cart items
    const subtotal = dbCartItems.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.product.price)
      return sum + price * item.quantity
    }, 0)

    // Re-validate coupon server-side — never trust client-supplied discount amounts
    const couponCode = (formData.get('couponCode') as string | null)?.trim().toUpperCase() ?? ''
    let discountRaw = 0
    if (couponCode) {
      const coupon = await db.query.coupons.findFirst({
        where: and(eq(schema.coupons.code, couponCode), eq(schema.coupons.isActive, true)),
      })
      if (coupon) {
        const couponValue = Number.parseFloat(coupon.value)
        discountRaw = coupon.type === 'percentage'
          ? Math.round(subtotal * couponValue) / 100
          : couponValue
      }
    }
    const tax = subtotal * 0.08
    const deliveryFee = 0
    const afterDiscount = Math.max(0, subtotal - discountRaw)
    const baseTotal = afterDiscount + tax + deliveryFee
    const stripeFee = Math.round((baseTotal * 0.029 + 0.30) * 100) / 100
    const total = baseTotal + stripeFee

    // Serialize delivery address into deliveryInstructions — orders table has no address columns
    const deliveryAddress = JSON.stringify({ name, street, city, state, zipCode })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.max(50, Math.round(total * 100)),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: session.user.id,
        customerName: name,
        customerEmail: email,
      },
    })

    // Create pending order in database
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    const [order] = await db.insert(schema.orders).values({
      orderNumber,
      userId: session.user.id,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      discount: discountRaw.toFixed(2),
      total: total.toFixed(2),
      paymentIntentId: paymentIntent.id,
      deliveryInstructions: deliveryAddress,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || null,
    }).returning()

    // Insert order items from database cart
    await db.insert(schema.orderItems).values(
      dbCartItems.map((item: { productId: string, quantity: number, product: { name: string, price: string } }) => {
        const unitPrice = Number.parseFloat(item.product.price)
        return {
          orderId: order.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: unitPrice.toFixed(2),
          subtotal: (unitPrice * item.quantity).toFixed(2),
        }
      }),
    )

    // Clear cart after creating order
    await clearCart()

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      orderId: order.id,
    }
  }
  catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      message: 'Failed to create payment. Please try again.',
    }
  }
}

export async function confirmOrder(orderId: string) {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    const db = getDb()

    // Verify ownership: only the order owner (or guest orders with no userId) can confirm
    const existing = await db.query.orders.findFirst({
      where: eq(schema.orders.id, orderId),
    })
    if (!existing)
      throw new Error('Order not found')
    if (existing.userId && existing.userId !== session?.user.id)
      throw new Error('Unauthorized')

    const [confirmed] = await db
      .update(schema.orders)
      .set({
        status: 'confirmed',
        paymentStatus: 'succeeded',
        confirmedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId))
      .returning()

    const items = await db.query.orderItems.findMany({ where: eq(schema.orderItems.orderId, orderId) })

    if (confirmed.customerEmail) {
      await sendOrderConfirmation(confirmed.customerEmail, {
        orderNumber: confirmed.orderNumber,
        items: items.map(i => ({
          name: i.productName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        subtotal: confirmed.subtotal,
        tax: confirmed.tax,
        deliveryFee: confirmed.deliveryFee,
        total: confirmed.total,
        deliveryAddress: confirmed.customerName ?? '',
      })
    }

    redirect(`/orders/${orderId}?success=true`)
  }
  catch (error) {
    console.error('Error confirming order:', error)
    throw error
  }
}
