# Polish: Error Pages, Loading Skeletons & SEO Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Add error pages (404/500), loading skeletons, and SEO metadata to both client and admin apps.

**Architecture:** Next.js App Router conventions: `not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx` per route. `generateMetadata` for client product pages. No new dependencies.

**Tech Stack:** Next.js App Router, Tailwind CSS

---

### Task 1: Client error pages

**Files:**
- Create: `client/app/not-found.tsx`
- Create: `client/app/error.tsx`
- Create: `client/app/global-error.tsx`

- [ ] Create `client/app/not-found.tsx`:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/" className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700">
        Go home
      </Link>
    </div>
  );
}
```

- [ ] Create `client/app/error.tsx`:

```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700">
        Try again
      </button>
    </div>
  );
}
```

- [ ] Create `client/app/global-error.tsx`:

```tsx
'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h1>
          <button onClick={reset} style={{ background: '#16a34a', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

- [ ] Commit:
```bash
git add client/app/not-found.tsx client/app/error.tsx client/app/global-error.tsx
git commit -m "feat(client): add 404, error, and global-error pages"
```

---

### Task 2: Admin error pages

**Files:**
- Create: `admin/app/not-found.tsx`
- Create: `admin/app/error.tsx`
- Create: `admin/app/global-error.tsx`

- [ ] Create `admin/app/not-found.tsx`:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <Link href="/" className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium">Go to dashboard</Link>
    </div>
  );
}
```

- [ ] Create `admin/app/error.tsx`:

```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <button onClick={reset} className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium">Try again</button>
    </div>
  );
}
```

- [ ] Create `admin/app/global-error.tsx` with same content as client version.

- [ ] Commit:
```bash
git add admin/app/not-found.tsx admin/app/error.tsx admin/app/global-error.tsx
git commit -m "feat(admin): add 404, error, and global-error pages"
```

---

### Task 3: Client loading skeletons

**Files:**
- Create: `client/app/products/loading.tsx`
- Create: `client/app/products/[id]/loading.tsx`
- Create: `client/app/orders/loading.tsx`
- Create: `client/app/orders/[id]/loading.tsx`
- Create: `client/app/account/loading.tsx`

- [ ] Create `client/app/products/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="flex gap-3 mb-6">
        {[1,2,3,4].map((i) => <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] Create `client/app/products/[id]/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] Create `client/app/orders/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] Create `client/app/orders/[id]/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
```

- [ ] Create `client/app/account/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/loading.tsx client/app/products/[id]/loading.tsx client/app/orders/loading.tsx client/app/orders/[id]/loading.tsx client/app/account/loading.tsx
git commit -m "feat(client): add loading skeletons for data pages"
```

---

### Task 4: Admin loading skeletons

**Files:**
- Create: `admin/app/loading.tsx`
- Create: `admin/app/products/loading.tsx`
- Create: `admin/app/orders/loading.tsx`
- Create: `admin/app/users/loading.tsx`
- Create: `admin/app/reviews/loading.tsx`
- Create: `admin/app/audit-logs/loading.tsx`

- [ ] Create `admin/app/loading.tsx` (dashboard):

```tsx
export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}
      </div>
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
```

- [ ] Create identical table skeleton for `admin/app/products/loading.tsx`, `admin/app/orders/loading.tsx`, `admin/app/users/loading.tsx`, `admin/app/reviews/loading.tsx`, `admin/app/audit-logs/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
```

- [ ] Commit:
```bash
git add admin/app/loading.tsx admin/app/products/loading.tsx admin/app/orders/loading.tsx admin/app/users/loading.tsx admin/app/reviews/loading.tsx admin/app/audit-logs/loading.tsx
git commit -m "feat(admin): add loading skeletons for all data pages"
```

---

### Task 5: SEO metadata for client

**Files:**
- Modify: `client/app/layout.tsx`
- Modify: `client/app/products/page.tsx`

Product detail metadata is already handled in plan-03 via `generateMetadata`. This task covers the root layout and products list.

- [ ] In `client/app/layout.tsx`, add metadata export before the layout function:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Tayo — Fresh Groceries Delivered',
    template: '%s | Tayo',
  },
  description: 'Shop fresh, healthy groceries and get them delivered to your door.',
  openGraph: {
    siteName: 'Tayo',
    type: 'website',
  },
};
```

- [ ] In `client/app/products/page.tsx`, add:

```tsx
export const metadata = {
  title: 'Products',
  description: 'Browse our full range of fresh groceries and healthy foods.',
};
```

- [ ] Add JSON-LD structured data to `client/app/products/[id]/page.tsx` inside the returned JSX:

```tsx
// Add inside the <ProductDetailClient> wrapper or below it in the server component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.imageUrl,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      ...(ratings && ratings.totalReviews > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: ratings.averageRating,
          reviewCount: ratings.totalReviews,
        },
      }),
    }),
  }}
/>
```

- [ ] Commit:
```bash
git add client/app/layout.tsx client/app/products/page.tsx client/app/products/[id]/page.tsx
git commit -m "feat(client): add SEO metadata and JSON-LD structured data"
```

---

### Task 6: Verify builds

- [ ] Run `bun run build --filter client` — must complete with no errors
- [ ] Run `bun run build --filter admin` — must complete with no errors
- [ ] Run `bun run typecheck --filter client` — no type errors
- [ ] Run `bun run typecheck --filter admin` — no type errors
