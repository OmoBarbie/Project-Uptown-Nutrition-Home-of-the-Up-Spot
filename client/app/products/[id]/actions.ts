'use server'

import { getDb, schema } from '@tayo/database'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function submitReview(productId: string, data: {
  rating: number
  title: string
  comment: string
}) {
  const db = getDb()
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session)
    return { error: 'You must be logged in to leave a review' }

  if (data.rating < 1 || data.rating > 5)
    return { error: 'Invalid rating' }
  if (data.comment.trim().length < 20)
    return { error: 'Comment must be at least 20 characters' }

  const existing = await db.query.reviews.findFirst({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.userId, session.user.id)),
  })
  if (existing)
    return { error: 'You have already reviewed this product' }

  const purchasedOrder = await db.query.orderItems.findFirst({
    with: { order: { columns: { status: true, userId: true } } },
    where: and(
      eq(schema.orderItems.productId, productId),
      inArray(schema.orderItems.orderId,
        db.select({ id: schema.orders.id })
          .from(schema.orders)
          .where(and(
            eq(schema.orders.userId, session.user.id),
            inArray(schema.orders.status, ['confirmed', 'preparing', 'ready_for_pickup', 'delivered', 'completed']),
          )),
      ),
    ),
  })

  if (!purchasedOrder)
    return { error: 'You can only review products you have purchased.' }

  const isVerifiedPurchase = purchasedOrder.order.status === 'completed'

  await db.insert(schema.reviews).values({
    productId,
    userId: session.user.id,
    rating: data.rating,
    title: data.title.trim() || null,
    comment: data.comment.trim(),
    isVerifiedPurchase,
    isApproved: false,
  })

  revalidatePath(`/products/${productId}`)
  return { success: true }
}

export async function markReviewHelpful(reviewId: string, isHelpful: boolean) {
  const db = getDb()
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session)
    return { error: 'You must be logged in' }

  try {
    const existing = await db.query.reviewHelpful.findFirst({
      where: and(eq(schema.reviewHelpful.reviewId, reviewId), eq(schema.reviewHelpful.userId, session.user.id)),
    })

    if (existing) {
      if (existing.isHelpful !== isHelpful) {
        await db.update(schema.reviewHelpful).set({ isHelpful }).where(eq(schema.reviewHelpful.id, existing.id))
        const delta = isHelpful ? 1 : -1
        await db.update(schema.reviews)
          .set({ helpfulCount: sql`${schema.reviews.helpfulCount} + ${delta}` })
          .where(eq(schema.reviews.id, reviewId))
      }
    }
    else {
      await db.insert(schema.reviewHelpful).values({ reviewId, userId: session.user.id, isHelpful })
      if (isHelpful) {
        await db.update(schema.reviews).set({ helpfulCount: sql`${schema.reviews.helpfulCount} + 1` }).where(eq(schema.reviews.id, reviewId))
      }
    }

    const review = await db.query.reviews.findFirst({
      where: eq(schema.reviews.id, reviewId),
      columns: { productId: true },
    })
    if (review) {
      revalidatePath(`/products/${review.productId}`)
    }
    return { success: true }
  }
  catch {
    return { error: 'Failed to record your vote' }
  }
}
