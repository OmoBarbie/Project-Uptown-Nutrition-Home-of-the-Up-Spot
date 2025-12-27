// Example Server Actions - Server-side only
// These functions run on the server and can safely access the database

'use server';

import { getDb, schema } from '@tayo/database';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addToCart(userId: string, productId: string, variantId?: string) {
  try {
    const db = getDb();

    // Find or create cart for user
    let cart = await db.query.carts.findFirst({
      where: eq(schema.carts.userId, userId),
    });

    if (!cart) {
      const [newCart] = await db.insert(schema.carts).values({
        userId,
      }).returning();
      cart = newCart;
    }

    // Check if item already exists in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.productId, productId),
        variantId
          ? eq(schema.cartItems.variantId, variantId)
          : eq(schema.cartItems.variantId, null as any)
      ),
    });

    if (existingItem) {
      // Update quantity
      await db.update(schema.cartItems)
        .set({ quantity: existingItem.quantity + 1 })
        .where(eq(schema.cartItems.id, existingItem.id));
    } else {
      // Add new item
      await db.insert(schema.cartItems).values({
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity: 1,
      });
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function getCartItems(userId: string) {
  try {
    const db = getDb();

    const cart = await db.query.carts.findFirst({
      where: eq(schema.carts.userId, userId),
      with: {
        cartItems: {
          with: {
            product: true,
            variant: true,
          },
        },
      },
    });

    return cart?.cartItems || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}
