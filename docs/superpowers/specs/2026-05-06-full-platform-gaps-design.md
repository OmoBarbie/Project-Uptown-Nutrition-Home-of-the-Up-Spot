# Full Platform Gaps — Design Spec
**Date:** 2026-05-06  
**Scope:** Client (user-facing) + Admin dashboard  
**Status:** Approved

---

## Overview

This spec covers 9 sub-projects that address missing features, broken flows, and production-readiness gaps across the Tayo e-commerce monorepo. The monorepo has 4 existing workspaces (`client`, `admin`, `components`, `database`); one new workspace (`email`) is added.

---

## Sub-project 1: Foundation — Email Package & Rate Limiting

### New workspace: `@tayo/email`

Location: `/email`

```
email/
├── src/
│   ├── index.ts                    — Resend client singleton (uses RESEND_API_KEY env var)
│   ├── send.ts                     — typed send() helpers per template
│   └── templates/
│       ├── order-confirmation.tsx
│       ├── verify-email.tsx
│       ├── reset-password.tsx
│       ├── order-status-update.tsx
│       └── refund-notification.tsx
└── package.json                    — name: @tayo/email
```

**Dependencies:** `resend`, `@react-email/components`  
**New env vars:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`  
**Removes:** existing `SMTP_*` env vars from `.env.example`

### Rate limiting

**Package:** `@upstash/ratelimit` + `@upstash/redis`  
**New env vars:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (both apps)

Limits applied in `middleware.ts` of both `client` and `admin`:
- `/api/auth/*`: 5 requests / 15 min per IP
- `/api/products` and other public APIs: 60 requests / min per IP
- Response on breach: `429 Too Many Requests` with `Retry-After` header

---

## Sub-project 2: Core Client Flows

### Product detail page — `client/app/products/[id]/page.tsx`

Server component. Data fetched in parallel: product row, variants, aggregate ratings.

**Layout (top to bottom):**
1. Product image (full-width, uses `imageUrl` from DB; Cloudinary URL if available)
2. Name, price, `compareAtPrice` with strikethrough if populated
3. Variant selector (client component) — renders if `productVariants` exist; each option shows name + price modifier delta; selected `variantId` stored in local state
4. Quantity stepper (min 1, max `stockQuantity`)
5. Add to Cart button — calls `addToCart(productId, variantId, quantity)` server action
6. Nutrition info accordion — renders only if any nutrition field is non-null
7. Reviews summary — avg rating stars + total count, smooth-scroll anchor to reviews section
8. Reviews section (see Sub-project 5)

**Variant selection:** client component `<VariantSelector>` inside the server page. Passes selected `variantId` up to `<AddToCartButton>` via shared state. No new DB columns needed — `cartItems.variantId` already exists.

### Guest cart merge

`mergeGuestCart(userId, sessionId)` server action already exists in `client/app/actions/cart.ts`.

Wire-up: in `client/lib/auth-client.ts`, add a `fetchOptions.onSuccess` callback to the `signIn.email()` call that reads a `tayo_session_id` cookie (set on first `addToCart` for unauthenticated users) and calls `mergeGuestCart`. Cookie is deleted after merge.

The `sessionId` cookie is set in `addToCart` when `userId` is null, using `cookies().set('tayo_session_id', nanoid(), { maxAge: 60 * 60 * 24 * 30 })`.

---

## Sub-project 3: Auth Completions

### Email verification

Enable Better Auth `emailVerification` plugin in `client/lib/auth.ts`:
```ts
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerifyEmail({ to: user.email, url })
  }
}
```

New client page: `client/app/(auth)/verify-email/page.tsx` — reads `token` from URL, calls Better Auth verify endpoint, shows success/error state.

Unverified users see a dismissible banner on `client/app/account/page.tsx` with a "Resend verification" button.

### Password reset

Enable Better Auth `forgetPassword` in `client/lib/auth.ts`:
```ts
forgetPassword: {
  sendResetPasswordEmail: async ({ user, url }) => {
    await sendResetPasswordEmail({ to: user.email, url })
  }
}
```

Two new client pages (reuse `(auth)` layout):
- `client/app/(auth)/forgot-password/page.tsx` — email input, calls `authClient.forgetPassword()`
- `client/app/(auth)/reset-password/page.tsx` — new password form, reads `token` from URL query param, calls `authClient.resetPassword()`

"Forgot password?" link added to existing `client/app/(auth)/login/page.tsx`.

### Transactional emails

- **Order confirmation:** triggered in `client/app/checkout/actions.ts` inside `confirmOrder()` after status → `confirmed`
- **Order status update:** triggered in `admin/app/orders/[id]/order-status-form.tsx` when status changes to `out_for_delivery` or `delivered`

---

## Sub-project 4: Admin Completions

### Categories management

New pages:
- `admin/app/categories/page.tsx` — table of all categories (name, slug, product count, active, sort order); "New Category" button
- `admin/app/categories/new/page.tsx` — create form
- `admin/app/categories/[id]/edit/page.tsx` — edit form
- `admin/app/categories/actions.ts` — server actions: `createCategory`, `updateCategory`, `deleteCategory` (soft: sets `isActive = false` if products exist, hard delete otherwise)

Form fields: name, slug (auto-generated from name, editable), description, imageUrl, sortOrder (number), isActive toggle.

### Product variants UI

`admin/app/products/product-form.tsx` gains a "Variants" section below the main fields:
- Dynamic list rendered from a `variants` state array
- Each row: name input, type select (size/flavor/option), price modifier input (±), stock quantity input, remove button
- "Add variant" button appends a blank row
- On save, variants are upserted via `admin/app/products/actions.ts`

### User management

New pages:
- `admin/app/users/page.tsx` — paginated table: email, name, role badge, join date, order count; search by email
- `admin/app/users/[id]/page.tsx` — user detail: role-change dropdown, `isBanned` toggle, order history list

**Schema change:** add `isBanned boolean default false` column to `users` table in `database/src/schema/users.ts`. Banned users are blocked at `client/middleware.ts` (check session + `isBanned` flag).

### Reviews moderation

New pages:
- `admin/app/reviews/page.tsx` — tabs: Pending / Approved / All. Table: product name, user, rating stars, title, comment excerpt, verified badge, date. Row actions: Approve, Reject (delete), Feature. Bulk approve checkbox.
- Server action `admin/app/reviews/actions.ts`: `approveReview`, `rejectReview`, `featureReview`, `bulkApproveReviews`

On approval, a separate action recalculates `productRatings` for that product (count all approved reviews, compute averages per star level).

### Audit log viewer

New page: `admin/app/audit-logs/page.tsx`
- Read-only table: action badge, entity type, entity ID (clickable link to that entity), user email, timestamp
- Filters: entity type select, date range inputs (from/to)
- Clicking a row expands a JSON diff viewer showing `changes` field
- No server actions — reads only

### Dashboard analytics

`admin/app/page.tsx` replaces placeholder with real queries.

**Top row — Today snapshot:**
- Orders today (count where `createdAt >= today`)
- Revenue today (sum of `total` for confirmed+ orders today)
- Low-stock products (count where `stockQuantity < 10`, links to filtered products page)
- Recent 5 orders table (orderNumber, customer, total, status badge)

**Below — 30-day section:**
- Revenue line chart (daily totals, last 30 days) — `recharts` LineChart
- Order status donut chart — count per status
- Top 5 products by units sold (sum `orderItems.quantity` grouped by `productId`)
- New customers (users with `role = customer` created in last 30 days)

**New dependency (admin only):** `recharts`

---

## Sub-project 5: Client Features — Reviews & Discovery

### Reviews UI (product detail page)

Added to `/products/[id]` below the product info section.

**Aggregate ratings bar:**
- Average score (large), total review count
- 5-bar breakdown (5★ → 1★) showing percentage fill from `productRatings` table

**Review list:**
- 10 per page, default sort newest first; sort options: newest, highest rated, most helpful
- Each card: star rating, title, comment, verified badge (if `isVerifiedPurchase`), helpful count, date
- "Was this helpful?" thumbs up/down — calls server action `markReviewHelpful(reviewId, isHelpful)`; updates `reviewHelpful` table

**Leave a review:**
- "Write a Review" button visible to logged-in users only
- Opens a `<Dialog>` from `@tayo/components`
- Fields: star rating (interactive), title, comment (min 20 chars)
- On submit: server action `submitReview(productId, data)` checks if user has a completed order containing this product (`orderItems` join `orders` where `status = completed`) — sets `isVerifiedPurchase` accordingly, saves with `isApproved = false`
- Toast confirmation: "Your review has been submitted and is pending approval"

### Product search & filtering

`client/app/products/page.tsx` becomes a server component reading `searchParams`.

**URL params:**
| Param | Values | DB operation |
|-------|--------|--------------|
| `q` | string | `ILIKE '%q%'` on name + description |
| `category` | category slug | join `categories` where `slug = category` |
| `sort` | `price_asc`, `price_desc`, `newest`, `popular` | ORDER BY clause |
| `page` | number | LIMIT 12 OFFSET (page-1)*12 |

**`<ProductFilters>` client component:**
- Search input (debounced 300ms, updates URL)
- Category pills (fetched once, rendered as toggle buttons)
- Sort dropdown
- All interactions push to URL via `useRouter().push()` with updated params

**Pagination:** uses existing `pagination.tsx` from `@tayo/components`. Total count returned alongside products for page calculation.

---

## Sub-project 6: Checkout Additions — Coupons & Refunds

### Coupon system

**New DB table:**
```ts
coupons: {
  id: cuid2,
  code: text (unique, uppercase),
  type: enum('flat', 'percentage'),
  value: numeric,        // dollar amount or 0-100
  isActive: boolean,
  createdAt, updatedAt
}
```

**Admin:** new `/coupons` page — table of codes, type, value, active status. Create form: code, type, value, active. Deactivate toggle. No delete (preserve history on orders).

**Client checkout:**
- Coupon input field added above order summary in `client/app/checkout/checkout-form.tsx`
- "Apply" button calls server action `applyCoupon(code)`:
  - Validates code exists and `isActive = true`
  - Returns discount amount (flat value or `total * value/100`)
  - Stores applied `couponCode` in component state
- On `createPaymentIntent`, discount is subtracted from amount; `orders.discount` field stores the amount

### Order refunds

**Admin** `admin/app/orders/[id]/page.tsx`:
- "Refund Order" button appears when `paymentStatus = succeeded` and `status` is not already `refunded`
- Opens confirmation `<Dialog>` with reason select: `duplicate`, `fraudulent`, `customer_request`, `other`
- Confirm calls server action `refundOrder(orderId, reason)`:
  1. `stripe.refunds.create({ payment_intent: order.paymentIntentId })`
  2. Update `orders.paymentStatus = refunded`, `orders.status = refunded`
  3. `createAuditLog(userId, { action: 'update', entityType: 'order', entityId: orderId, changes: { refundReason: reason } })`
  4. Send `refund-notification` email to customer via `@tayo/email`

New email template: `email/src/templates/refund-notification.tsx` — shows order number, refund amount, reason.

---

## Sub-project 7: Polish

### Error pages

Both `client` and `admin`:
- `app/not-found.tsx` — 404 with back-navigation
- `app/error.tsx` — caught render error, "Something went wrong" + retry button (`error.reset()`)
- `app/global-error.tsx` — root layout error boundary

### Loading skeletons

Co-located `loading.tsx` per data-heavy route (Next.js convention, auto-shown during server component fetch):

**Client:** `/products`, `/products/[id]`, `/orders`, `/orders/[id]`, `/account`  
**Admin:** `/` (dashboard), `/products`, `/orders`, `/users`, `/reviews`, `/audit-logs`

Skeletons use `animate-pulse` divs matching the page layout shape. No new dependencies.

### SEO meta tags (client only)

`generateMetadata()` exports added to:
- `client/app/products/[id]/page.tsx` — `title: product.name`, `description: product.description`, `openGraph.images: [product.imageUrl]`
- `client/app/products/page.tsx` — catalog title + description
- `client/app/layout.tsx` — site-wide defaults, title template `"%s | Tayo"`

Structured data (`<script type="application/ld+json">`) in product detail page using `Product` JSON-LD schema for Google rich results.

---

## Schema Changes Summary

| Table | Change |
|-------|--------|
| `users` | Add `isBanned boolean default false` |
| `coupons` | New table (id, code, type, value, isActive, timestamps) |

All other DB structures (reviews, productRatings, orderItems, etc.) already exist and require no migration.

---

## New Env Vars Summary

| Var | Used by | Purpose |
|-----|---------|---------|
| `RESEND_API_KEY` | both apps | Resend email API |
| `RESEND_FROM_EMAIL` | both apps | Sender address |
| `UPSTASH_REDIS_REST_URL` | both apps | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | both apps | Rate limiting |

Remove from `.env.example`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`

---

## Execution Order

1. `@tayo/email` package + Resend setup
2. Rate limiting middleware (both apps)
3. Product detail page + variant selector + guest cart merge
4. Auth completions (email verification, password reset)
5. Admin: categories UI + product variants in form
6. Admin: user management + `isBanned` migration
7. Admin: reviews moderation + `productRatings` recalculation
8. Admin: audit log viewer
9. Admin: dashboard analytics + recharts
10. Client: reviews UI on product detail
11. Client: search + filtering + pagination on `/products`
12. Coupons system (DB migration + admin UI + checkout wiring)
13. Order refunds (admin action + Stripe + email)
14. Error pages + loading skeletons (both apps)
15. SEO meta tags + structured data (client)
