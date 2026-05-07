'use server';

import { getDb, schema } from '@tayo/database';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

async function recalculateProductRatings(productId: string) {
  const db = getDb();
  const approved = await db.query.reviews.findMany({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.isApproved, true)),
    columns: { rating: true },
  });

  if (approved.length === 0) {
    await db.delete(schema.productRatings).where(eq(schema.productRatings.productId, productId));
    return;
  }

  const total = approved.length;
  const average = approved.reduce((sum, r) => sum + r.rating, 0) / total;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  for (const r of approved) counts[r.rating] = (counts[r.rating] ?? 0) + 1;

  await db
    .insert(schema.productRatings)
    .values({
      productId,
      averageRating: Math.round(average),
      totalReviews: total,
      oneStar: counts[1],
      twoStar: counts[2],
      threeStar: counts[3],
      fourStar: counts[4],
      fiveStar: counts[5],
    })
    .onConflictDoUpdate({
      target: schema.productRatings.productId,
      set: {
        averageRating: Math.round(average),
        totalReviews: total,
        oneStar: counts[1],
        twoStar: counts[2],
        threeStar: counts[3],
        fourStar: counts[4],
        fiveStar: counts[5],
        updatedAt: new Date(),
      },
    });
}

export async function approveReview(reviewId: string) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, reviewId) });
  if (!review) return;
  await db
    .update(schema.reviews)
    .set({ isApproved: true, updatedAt: new Date() })
    .where(eq(schema.reviews.id, reviewId));
  await recalculateProductRatings(review.productId);
  if (session) {
    await createAuditLog(session.user.id, {
      action: 'update', entityType: 'review', entityId: reviewId,
      changes: { after: { isApproved: true } },
    });
  }
  revalidatePath('/reviews');
}

export async function rejectReview(reviewId: string) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, reviewId) });
  if (!review) return;
  await db.delete(schema.reviews).where(eq(schema.reviews.id, reviewId));
  await recalculateProductRatings(review.productId);
  if (session) {
    await createAuditLog(session.user.id, {
      action: 'delete', entityType: 'review', entityId: reviewId,
      changes: { before: { productId: review.productId, rating: review.rating } },
    });
  }
  revalidatePath('/reviews');
}

export async function featureReview(reviewId: string, isFeatured: boolean) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  await db
    .update(schema.reviews)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(schema.reviews.id, reviewId));
  if (session) {
    await createAuditLog(session.user.id, {
      action: 'update', entityType: 'review', entityId: reviewId,
      changes: { after: { isFeatured } },
    });
  }
  revalidatePath('/reviews');
}

export async function bulkApproveReviews(reviewIds: string[]) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  for (const id of reviewIds) {
    const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, id) });
    if (!review) continue;
    await db
      .update(schema.reviews)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(schema.reviews.id, id));
    await recalculateProductRatings(review.productId);
  }
  if (session && reviewIds.length > 0) {
    await createAuditLog(session.user.id, {
      action: 'update', entityType: 'review', entityId: reviewIds[0],
      changes: { after: { bulkApproved: reviewIds.length } },
    });
  }
  revalidatePath('/reviews');
}
