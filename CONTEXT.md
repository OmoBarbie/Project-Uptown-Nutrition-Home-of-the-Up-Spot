# Uptown Nutrition — Domain Context

## Business Overview

**Uptown Nutrition** is a physical health food business. Customers order food items online and collect them in-store (**pickup only** — delivery is not yet operational, though the schema has delivery infrastructure for future use).

**The Up Spot** is a rentable event space located within the Uptown Nutrition premises. It is a separate offering from the food menu. It is not modelled in the current codebase.

**The Up Spot booking (roadmap):** Customers will be able to enquire about availability online. Once the admin confirms the space is available, the customer pays upfront online to complete the booking. This is a two-step flow: enquiry → admin confirms availability → customer pays. Not instant self-serve booking.

**Newsletter** — Uptown Nutrition sends a newsletter to subscribers covering: new menu items, weekly specials, nutrition tips, and general communications to stay in touch with the customer base. Frequency is ad hoc (sent when there is relevant news). Managed via the admin panel; subscribers can unsubscribe via a tokenised link in each email.

## Glossary

### Product

A food item sold by Uptown Nutrition (e.g. "Mango Smoothie"). Products belong to a **Category** and may have one or more **Variants**.

### Category

A grouping of related products (e.g. Smoothies, Bowls, Supplements, Snacks).

### Sale Price

A Product is **on sale** when `compareAtPrice` is set and greater than `price`. The `compareAtPrice` is shown as a strike-through (e.g. ~~$12.00~~ $9.00) to communicate the reduced price. There is no separate sale period — the product is on sale for as long as `compareAtPrice` is set.

### Variant

A purchasable variation of a Product differing in size, flavor, or option (e.g. 16oz vs 24oz, Chocolate vs Vanilla). A Variant carries a `priceModifier` that adjusts the Product's base price. A Product without Variants is sold at its base price.

### Address

A saved delivery address belonging to a User. Has an `isDefault` flag for convenience.

**Currently unused at checkout** — since only pickup is operational, customers walk in to collect their order and no delivery address is needed. The checkout form collects address fields as a placeholder for when delivery launches. The `deliveryAddressId` FK on Order is always null for now; the address snapshot is stored as JSON in `deliveryInstructions` instead.

### Cart

A collection of CartItems belonging to either an authenticated User or a guest (identified by a `sessionId` cookie). Guests can add items freely; checkout requires authentication.

**Cart merge:** When a guest logs in, their guest cart items are automatically merged into their authenticated cart. If both carts contain the same product+variant, quantities are combined.

### Order

A customer's purchase of one or more Products. Always belongs to an authenticated User (no guest orders).

**Order lifecycle:**

| Status | Triggered by | Meaning |
|--------|-------------|---------|
| `pending` | System | Payment intent created; awaiting payment confirmation |
| `confirmed` | Stripe webhook | Payment succeeded |
| `preparing` | Admin | Kitchen has started making the order |
| `ready_for_pickup` | Admin | Order is bagged and ready at the counter |
| `delivered` | Admin (pickup) / Customer (future delivery) | Customer has collected their order. In a future delivery context, triggered when the customer confirms receipt |
| `completed` | Admin | Final administrative close. Set after the return/dispute window passes to signal no further action is needed |
| `cancelled` | Admin only | Order will not be fulfilled |
| `refunded` | Stripe webhook | Payment has been refunded |

> **Note:** Delivery is not yet operational. `out_for_delivery` status exists in the schema for future use.

### User Roles

| Role | Can do |
|------|--------|
| `customer` | Browse products, place orders, leave reviews, manage their own account. A banned customer can still browse but cannot place orders or submit reviews |
| `admin` | Manage products, categories, orders, reviews, coupons; view audit logs |
| `super_admin` | Everything `admin` can do, plus: promote users to `admin`, and promote/demote `super_admin` — exclusively reserved for existing `super_admin` users |

**Known code gap:** The `isBanned` flag on User is not currently enforced in any client action — a banned user can still place orders and submit reviews. Needs enforcement in `confirmOrder` and the review submission action.

**Known code bug:** The admin middleware (`admin/lib/proxy.ts`) checks `role === 'admin'` strictly, which locks `super_admin` out of the admin panel entirely. Needs to be `role === 'admin' || role === 'super_admin'`.

### Coupon

A discount code entered by a customer at checkout. Applied to the entire cart subtotal.

- **`flat`** — deducts a fixed dollar amount from the subtotal
- **`percentage`** — deducts a percentage of the subtotal

**Cash payment:** The `cash` payment method represents an out-of-band payment — the customer pays the admin directly in person or via bank transfer. The admin manually marks the order's payment as resolved in the admin panel. This bypasses Stripe entirely.

**Known schema gap:** the `coupons` table is missing `expiresAt` (expiry date) and `usageLimit` / `usageCount` (max redemptions) fields. These are required business rules — a coupon should be deactivatable by date and by total number of uses.

### OrderItem

A snapshot of a Product (name, unit price) and quantity at the time of Order placement. Preserves the purchase record even if the Product is later edited or deleted.

### Review

A customer's written assessment of a Product, including a 1–5 star `rating`, optional `title`, and `comment`.

- **Who can review:** Only customers who have purchased the product. One review per customer per product.
- **Verified Purchase:** The `isVerifiedPurchase` flag is set manually by an admin (not auto-detected from order history).
- **Approval:** Every review requires admin approval before it becomes visible on the storefront. Unapproved reviews are invisible to customers.
- **Featured:** A featured review is highlighted on the product page. Only approved reviews should be featured.
- **Helpful votes:** Customers can vote a review helpful or not helpful (`reviewHelpful` table). The `helpfulCount` on the review is a running tally.

**Known code gap:** The review submission action (`client/app/products/[id]/actions.ts`) does not currently enforce that the reviewer has a completed order containing the product. It only checks the user is logged in and hasn't already reviewed.

### ProductRating

A pre-computed aggregate (average, total count, per-star breakdown) derived from all approved Reviews for a Product. Recalculated whenever a Review is approved or deleted.
