import { pgTable, varchar, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const couponTypeEnum = pgEnum('coupon_type', ['flat', 'percentage']);

export const coupons = pgTable('coupons', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  code: varchar('code', { length: 50 }).notNull().unique(),
  type: couponTypeEnum('type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
