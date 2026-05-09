'use server'

import { getDb, schema } from '@tayo/database'
import { and, eq, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { auth } from '@/lib/auth'

// Generate or get guest session ID
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('cart_session_id')?.value

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    cookieStore.set('cart_session_id', sessionId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  return sessionId
}

// Get or create cart for current user (authenticated or guest)
async function getOrCreateCart() {
  const db = getDb()
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  const userId = session?.user?.id
  const sessionId = await getOrCreateSessionId()

  if (userId) {
    // Authenticated: find user cart
    let cart = await db.query.carts.findFirst({
      where: eq(schema.carts.userId, userId),
    })

    // If no user cart, check for an unmerged guest cart and merge it first
    if (!cart) {
      const guestCart = await db.query.carts.findFirst({
        where: and(
          eq(schema.carts.sessionId, sessionId),
          isNull(schema.carts.userId),
        ),
        with: { cartItems: true },
      })

      if (guestCart && guestCart.cartItems.length > 0) {
        await mergeGuestCart(userId, sessionId)
        cart = await db.query.carts.findFirst({
          where: eq(schema.carts.userId, userId),
        })
      }
    }

    if (!cart) {
      const [newCart] = await db.insert(schema.carts).values({ userId }).returning()
      cart = newCart
    }

    return { cart, userId, sessionId }
  }

  // Guest: find or create by sessionId
  let cart = await db.query.carts.findFirst({
    where: and(
      eq(schema.carts.sessionId, sessionId),
      isNull(schema.carts.userId),
    ),
  })

  if (!cart) {
    const [newCart] = await db.insert(schema.carts).values({ sessionId }).returning()
    cart = newCart
  }

  return { cart, userId: null, sessionId }
}

export async function addToCart(productId: string, variantId?: string | null, quantity = 1) {
  try {
    const db = getDb()
    const { cart } = await getOrCreateCart()

    // Check if item already exists in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.productId, productId),
        variantId
          ? eq(schema.cartItems.variantId, variantId)
          : isNull(schema.cartItems.variantId),
      ),
    })

    if (existingItem) {
      // Update quantity
      await db.update(schema.cartItems)
        .set({
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(schema.cartItems.id, existingItem.id))
    }
    else {
      // Add new item
      await db.insert(schema.cartItems).values({
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
        quantity,
      })
    }

    revalidatePath('/cart')
    return { success: true }
  }
  catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

export async function removeFromCart(productId: string) {
  try {
    const db = getDb()
    const { cart } = await getOrCreateCart()

    await db.delete(schema.cartItems).where(
      and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.productId, productId),
      ),
    )

    revalidatePath('/cart')
    revalidatePath('/products')
    return { success: true }
  }
  catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    const db = getDb()
    const { cart } = await getOrCreateCart()

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.delete(schema.cartItems).where(
        and(
          eq(schema.cartItems.cartId, cart.id),
          eq(schema.cartItems.productId, productId),
        ),
      )
    }
    else {
      // Update quantity
      await db.update(schema.cartItems)
        .set({
          quantity,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(schema.cartItems.cartId, cart.id),
            eq(schema.cartItems.productId, productId),
          ),
        )
    }

    revalidatePath('/cart')
    revalidatePath('/products')
    return { success: true }
  }
  catch (error) {
    console.error('Error updating cart quantity:', error)
    return { success: false, error: 'Failed to update quantity' }
  }
}

export async function getCart() {
  try {
    const db = getDb()
    const { cart } = await getOrCreateCart()

    const cartWithItems = await db.query.carts.findFirst({
      where: eq(schema.carts.id, cart.id),
      with: {
        cartItems: {
          with: {
            product: true,
          },
        },
      },
    })

    return cartWithItems?.cartItems || []
  }
  catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export async function clearCart() {
  try {
    const db = getDb()
    const { cart } = await getOrCreateCart()

    await db.delete(schema.cartItems).where(
      eq(schema.cartItems.cartId, cart.id),
    )

    revalidatePath('/cart')
    revalidatePath('/products')
    return { success: true }
  }
  catch (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

// Merge guest cart into user cart when user logs in
export async function mergeGuestCart(userId: string, sessionId: string) {
  try {
    const db = getDb()

    // Find guest cart
    const guestCart = await db.query.carts.findFirst({
      where: and(
        eq(schema.carts.sessionId, sessionId),
        isNull(schema.carts.userId),
      ),
      with: {
        cartItems: true,
      },
    })

    if (!guestCart || guestCart.cartItems.length === 0) {
      return { success: true }
    }

    // Find or create user cart
    let userCart = await db.query.carts.findFirst({
      where: eq(schema.carts.userId, userId),
    })

    if (!userCart) {
      const [newCart] = await db.insert(schema.carts).values({
        userId,
      }).returning()
      userCart = newCart
    }

    // Merge items
    for (const item of guestCart.cartItems) {
      const existingItem = await db.query.cartItems.findFirst({
        where: and(
          eq(schema.cartItems.cartId, userCart.id),
          eq(schema.cartItems.productId, item.productId),
          item.variantId
            ? eq(schema.cartItems.variantId, item.variantId)
            : isNull(schema.cartItems.variantId),
        ),
      })

      if (existingItem) {
        // Update quantity
        await db.update(schema.cartItems)
          .set({
            quantity: existingItem.quantity + item.quantity,
            updatedAt: new Date(),
          })
          .where(eq(schema.cartItems.id, existingItem.id))
      }
      else {
        // Add new item
        await db.insert(schema.cartItems).values({
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        })
      }
    }

    // Delete guest cart
    await db.delete(schema.carts).where(eq(schema.carts.id, guestCart.id))

    revalidatePath('/cart')
    return { success: true }
  }
  catch (error) {
    console.error('Error merging guest cart:', error)
    return { success: false, error: 'Failed to merge cart' }
  }
}
