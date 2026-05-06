# Client Reviews UI & Product Search/Filter Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.
> **Depends on:** plan-03-product-detail (product detail page must exist)

**Goal:** Add reviews section to product detail page; add server-side search, filtering, and pagination to /products.

**Architecture:** Reviews section is a server component showing approved reviews, with a client modal for submission. Products page reads URL searchParams for q/category/sort/page and rerenders server-side.

**Tech Stack:** Next.js App Router, Drizzle ORM, server actions, `useRouter` for URL param updates

---

### Task 1: Review submission server action

**Files:**
- Create: `client/app/products/[id]/actions.ts`

- [ ] Create `client/app/products/[id]/actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function submitReview(productId: string, data: {
  rating: number;
  title: string;
  comment: string;
}) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) return { error: 'You must be logged in to leave a review' };

  if (data.rating < 1 || data.rating > 5) return { error: 'Invalid rating' };
  if (data.comment.trim().length < 20) return { error: 'Comment must be at least 20 characters' };

  // Check existing review
  const existing = await db.query.reviews.findFirst({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.userId, session.user.id)),
  });
  if (existing) return { error: 'You have already reviewed this product' };

  // Check if verified purchase
  const verifiedOrder = await db.query.orderItems.findFirst({
    with: {
      order: {
        columns: { status: true, userId: true },
      },
    },
    where: eq(schema.orderItems.productId, productId),
  });

  const isVerifiedPurchase = !!verifiedOrder &&
    verifiedOrder.order.userId === session.user.id &&
    verifiedOrder.order.status === 'completed';

  await db.insert(schema.reviews).values({
    productId,
    userId: session.user.id,
    rating: data.rating,
    title: data.title.trim() || null,
    comment: data.comment.trim(),
    isVerifiedPurchase,
    isApproved: false,
  });

  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function markReviewHelpful(reviewId: string, isHelpful: boolean) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) return;

  const existing = await db.query.reviewHelpful.findFirst({
    where: and(eq(schema.reviewHelpful.reviewId, reviewId), eq(schema.reviewHelpful.userId, session.user.id)),
  });

  if (existing) {
    await db.update(schema.reviewHelpful).set({ isHelpful }).where(eq(schema.reviewHelpful.id, existing.id));
  } else {
    await db.insert(schema.reviewHelpful).values({ reviewId, userId: session.user.id, isHelpful });
    if (isHelpful) {
      await db.update(schema.reviews).set({ helpfulCount: schema.reviews.helpfulCount + 1 }).where(eq(schema.reviews.id, reviewId));
    }
  }
}
```

- [ ] Commit:
```bash
git add client/app/products/[id]/actions.ts
git commit -m "feat(client): add review submission and helpful vote actions"
```

---

### Task 2: Review submission modal

**Files:**
- Create: `client/app/products/[id]/review-modal.tsx`

- [ ] Create `client/app/products/[id]/review-modal.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { submitReview } from './actions';

interface Props {
  productId: string;
  isLoggedIn: boolean;
}

export function ReviewModal({ productId, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return <a href="/login" className="text-sm text-green-700 underline">Log in to write a review</a>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setError('');
    startTransition(async () => {
      const result = await submitReview(productId, { rating, title, comment });
      if (result?.error) { setError(result.error); return; }
      setSuccess(true);
      setTimeout(() => { setOpen(false); setSuccess(false); setRating(0); setTitle(''); setComment(''); }, 2000);
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm bg-green-600 text-white px-4 py-2 rounded-md font-medium">
        Write a Review
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Write a Review</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {success ? (
              <p className="text-green-700 font-medium text-center py-4">Review submitted! It will appear after moderation.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (optional)</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} minLength={20} required rows={4} className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
                  {isPending ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/[id]/review-modal.tsx
git commit -m "feat(client): add review submission modal"
```

---

### Task 3: Reviews section server component

**Files:**
- Create: `client/app/products/[id]/reviews-section.tsx`

- [ ] Create `client/app/products/[id]/reviews-section.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ReviewModal } from './review-modal';

interface Props {
  productId: string;
  ratings: { averageRating: string; totalReviews: number; oneStar: number; twoStar: number; threeStar: number; fourStar: number; fiveStar: number } | null;
}

export async function ReviewsSection({ productId, ratings }: Props) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const reviews = await db.query.reviews.findMany({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.isApproved, true)),
    orderBy: [desc(schema.reviews.createdAt)],
    limit: 10,
  });

  const avg = ratings ? parseFloat(ratings.averageRating) : 0;
  const total = ratings?.totalReviews ?? 0;

  const starCounts = ratings
    ? [ratings.fiveStar, ratings.fourStar, ratings.threeStar, ratings.twoStar, ratings.oneStar]
    : [0, 0, 0, 0, 0];

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reviews {total > 0 && `(${total})`}</h2>
        <ReviewModal productId={productId} isLoggedIn={!!session} />
      </div>

      {/* Aggregate */}
      {total > 0 && (
        <div className="flex gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-4xl font-bold">{avg.toFixed(1)}</p>
            <p className="text-yellow-400 text-xl">{'★'.repeat(Math.round(avg))}</p>
            <p className="text-sm text-gray-500">{total} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right">{star}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: total > 0 ? `${(starCounts[i] / total) * 100}%` : '0%' }} />
                </div>
                <span className="text-gray-500 w-6">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                {r.isVerifiedPurchase && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified Purchase</span>}
              </div>
              <span className="text-sm text-gray-400">{r.createdAt.toLocaleDateString()}</span>
            </div>
            {r.title && <p className="font-semibold mb-1">{r.title}</p>}
            <p className="text-gray-700 text-sm">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-2">{r.helpfulCount} found this helpful</p>
          </div>
        ))}
        {reviews.length === 0 && total === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </div>
    </section>
  );
}
```

- [ ] Update `client/app/products/[id]/page.tsx` to import and render `ReviewsSection` inside the `#reviews` div:

```tsx
import { ReviewsSection } from './reviews-section';

// Replace the <div id="reviews"> placeholder:
<div id="reviews" className="mt-16">
  <ReviewsSection productId={id} ratings={ratings} />
</div>
```

- [ ] Pass full ratings object (with star breakdowns) from the page query. Update the `productRatings` query to include all star fields.

- [ ] Commit:
```bash
git add client/app/products/[id]/reviews-section.tsx client/app/products/[id]/page.tsx
git commit -m "feat(client): add reviews section to product detail page"
```

---

### Task 4: Product filters client component

**Files:**
- Create: `client/app/products/product-filters.tsx`

- [ ] Create `client/app/products/product-filters.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  currentQ: string;
  currentCategory: string;
  currentSort: string;
}

export function ProductFilters({ categories, currentQ, currentCategory, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page'); // Reset to page 1 on filter change
    startTransition(() => router.push(`/products?${params.toString()}`));
  }, [router, searchParams]);

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      {/* Search */}
      <input
        type="search"
        defaultValue={currentQ}
        placeholder="Search products…"
        onChange={(e) => {
          const v = e.target.value;
          const timer = setTimeout(() => updateParam('q', v), 300);
          return () => clearTimeout(timer);
        }}
        className="border rounded-md px-3 py-2 text-sm w-52"
      />

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => updateParam('category', '')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${!currentCategory ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => updateParam('category', c.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentCategory === c.slug ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="border rounded-md px-2 py-2 text-sm ml-auto"
      >
        <option value="">Sort: Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/product-filters.tsx
git commit -m "feat(client): add ProductFilters component with URL param sync"
```

---

### Task 5: Update products page with server-side search

**Files:**
- Modify: `client/app/products/page.tsx`

- [ ] Replace the data fetching in `client/app/products/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { eq, ilike, or, asc, desc, count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { ProductFilters } from './product-filters';

const PAGE_SIZE = 12;

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q, category, sort, page } = await searchParams;
  const db = getDb();
  const currentPage = Math.max(1, parseInt(page ?? '1'));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Fetch categories for filters
  const categories = await db.query.categories.findMany({
    where: eq(schema.categories.isActive, true),
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
    columns: { id: true, name: true, slug: true },
  });

  // Build where conditions
  const conditions = [eq(schema.products.isActive, true)];

  if (q) {
    conditions.push(or(
      ilike(schema.products.name, `%${q}%`),
      ilike(schema.products.description, `%${q}%`)
    )!);
  }

  if (category) {
    const cat = await db.query.categories.findFirst({ where: eq(schema.categories.slug, category) });
    if (cat) conditions.push(eq(schema.products.categoryId, cat.id));
  }

  // Sort
  let orderBy;
  if (sort === 'price_asc') orderBy = asc(schema.products.price);
  else if (sort === 'price_desc') orderBy = desc(schema.products.price);
  else if (sort === 'newest') orderBy = desc(schema.products.createdAt);
  else orderBy = desc(schema.products.isFeatured); // default: featured first

  // Count total for pagination
  const [{ total }] = await db.select({ total: count() }).from(schema.products).where(and(...conditions));

  const products = await db.query.products.findMany({
    where: and(...conditions),
    with: {
      category: { columns: { name: true } },
      variants: { where: eq(schema.productVariants.isActive, true), columns: { id: true, name: true, type: true, priceModifier: true } },
    },
    orderBy,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductFilters categories={categories} currentQ={q ?? ''} currentCategory={category ?? ''} currentSort={sort ?? ''} />
      {/* Existing ProductsList component */}
      <ProductsList products={products} />
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(sort && { sort }), page: String(p) });
            return (
              <a key={p} href={`/products?${params}`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${p === currentPage ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{p}</a>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

Note: Import `and` from drizzle-orm at the top. The `ProductsList` component is already imported in the original file — keep that import.

- [ ] Commit:
```bash
git add client/app/products/page.tsx
git commit -m "feat(client): add server-side search, filter, sort, pagination to products"
```
