import { pgTable, varchar, text, integer, decimal, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users, addresses } from './users';
import { products, productVariants } from './products';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'refunded'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'refunded'
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'credit_card',
  'debit_card',
  'paypal',
  'apple_pay',
  'google_pay',
  'cash'
]);

export const orders = pgTable('orders', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'restrict' }),

  // Order status
  status: orderStatusEnum('status').notNull().default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),

  // Pricing
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0.00'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0.00'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),

  // Payment
  paymentMethod: paymentMethodEnum('payment_method'),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),

  // Delivery/Pickup
  deliveryAddressId: varchar('delivery_address_id', { length: 128 }).references(() => addresses.id, { onDelete: 'set null' }),
  deliveryInstructions: text('delivery_instructions'),

  // Customer info (snapshot at time of order)
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),

  // Notes
  orderNotes: text('order_notes'),
  adminNotes: text('admin_notes'),

  // Timestamps
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('orders_user_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  orderNumberIdx: index('orders_number_idx').on(table.orderNumber),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
}));

export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  orderId: varchar('order_id', { length: 128 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 128 }).notNull().references(() => products.id, { onDelete: 'restrict' }),
  variantId: varchar('variant_id', { length: 128 }).references(() => productVariants.id, { onDelete: 'set null' }),

  // Snapshot at time of order
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantName: varchar('variant_name', { length: 100 }),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('order_items_order_idx').on(table.orderId),
  productIdx: index('order_items_product_idx').on(table.productId),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
