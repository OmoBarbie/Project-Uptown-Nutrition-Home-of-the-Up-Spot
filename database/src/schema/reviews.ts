import { pgTable, varchar, text, integer, timestamp, boolean, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { products } from './products';
import { orders } from './orders';

export const reviews = pgTable('reviews', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  productId: varchar('product_id', { length: 128 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: varchar('order_id', { length: 128 }).references(() => orders.id, { onDelete: 'set null' }),

  // Review content
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment').notNull(),

  // Helpful votes
  helpfulCount: integer('helpful_count').notNull().default(0),

  // Moderation
  isVerifiedPurchase: boolean('is_verified_purchase').notNull().default(false),
  isApproved: boolean('is_approved').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index('reviews_product_idx').on(table.productId),
  userIdx: index('reviews_user_idx').on(table.userId),
  ratingIdx: index('reviews_rating_idx').on(table.rating),
  approvedIdx: index('reviews_approved_idx').on(table.isApproved),
  ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
}));

export const reviewHelpful = pgTable('review_helpful', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  reviewId: varchar('review_id', { length: 128 }).notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  isHelpful: boolean('is_helpful').notNull(), // true = helpful, false = not helpful
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  reviewIdx: index('review_helpful_review_idx').on(table.reviewId),
  userIdx: index('review_helpful_user_idx').on(table.userId),
}));

export const productRatings = pgTable('product_ratings', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  productId: varchar('product_id', { length: 128 }).notNull().unique().references(() => products.id, { onDelete: 'cascade' }),

  // Aggregate ratings
  averageRating: integer('average_rating').notNull().default(0),
  totalReviews: integer('total_reviews').notNull().default(0),

  // Rating breakdown
  oneStar: integer('one_star').notNull().default(0),
  twoStar: integer('two_star').notNull().default(0),
  threeStar: integer('three_star').notNull().default(0),
  fourStar: integer('four_star').notNull().default(0),
  fiveStar: integer('five_star').notNull().default(0),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index('product_ratings_product_idx').on(table.productId),
  avgRatingIdx: index('product_ratings_avg_idx').on(table.averageRating),
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ReviewHelpful = typeof reviewHelpful.$inferSelect;
export type NewReviewHelpful = typeof reviewHelpful.$inferInsert;
export type ProductRating = typeof productRatings.$inferSelect;
export type NewProductRating = typeof productRatings.$inferInsert;
