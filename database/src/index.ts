export { getDb, schema } from './db';
export type { Database } from './db';

// Re-export all types
export type {
  User,
  NewUser,
  Address,
  NewAddress,
} from './schema/users';

export type {
  Category,
  NewCategory,
  Product,
  NewProduct,
  ProductVariant,
  NewProductVariant,
} from './schema/products';

export type {
  Cart,
  NewCart,
  CartItem,
  NewCartItem,
} from './schema/cart';

export type {
  Order,
  NewOrder,
  OrderItem,
  NewOrderItem,
} from './schema/orders';

export type {
  Review,
  NewReview,
  ReviewHelpful,
  NewReviewHelpful,
  ProductRating,
  NewProductRating,
} from './schema/reviews';
