import { pgTable, varchar, text, integer, decimal, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const categories = pgTable('categories', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  categoryId: varchar('category_id', { length: 128 }).notNull().references(() => categories.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  imageUrl: text('image_url').notNull(),
  imageAlt: varchar('image_alt', { length: 255 }),
  emoji: varchar('emoji', { length: 10 }),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),

  // Nutritional information
  calories: integer('calories'),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fiber: integer('fiber'),
  sugar: integer('sugar'),
  fat: integer('fat'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('products_category_idx').on(table.categoryId),
  slugIdx: index('products_slug_idx').on(table.slug),
  featuredIdx: index('products_featured_idx').on(table.isFeatured),
}));

export const productVariants = pgTable('product_variants', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  productId: varchar('product_id', { length: 128 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "24oz", "Chocolate", "Large"
  type: varchar('type', { length: 50 }).notNull(), // e.g., "size", "flavor", "option"
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).notNull().default('0.00'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdx: index('product_variants_product_idx').on(table.productId),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
