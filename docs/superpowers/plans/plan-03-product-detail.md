# Product Detail Page Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Build `/products/[id]` page with variant selection, quantity picker, and add-to-cart. Wire guest cart merge at login.

**Architecture:** Server component fetches product+variants+ratings. `<VariantSelector>` and `<AddToCartButton>` are client components that share selected state. Guest cart merge happens via `onSuccess` callback in the auth client.

**Tech Stack:** Next.js App Router, Drizzle ORM, Better Auth, existing `@tayo/database` schema

---

### Task 1: Update addToCart to accept variantId

**Files:**
- Modify: `client/app/actions/cart.ts`

The current `addToCart(productId)` doesn't accept a variantId. Update the signature and cartItems insert.

- [ ] Update `addToCart` signature and body in `client/app/actions/cart.ts`:

```ts
export async function addToCart(productId: string, variantId?: string | null, quantity = 1) {
  try {
    const db = getDb();
    const { cart } = await getOrCreateCart();

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.productId, productId),
        variantId
          ? eq(schema.cartItems.variantId, variantId)
          : isNull(schema.cartItems.variantId)
      ),
    });

    if (existingItem) {
      await db.update(schema.cartItems)
        .set({ quantity: existingItem.quantity + quantity, updatedAt: new Date() })
        .where(eq(schema.cartItems.id, existingItem.id));
    } else {
      await db.insert(schema.cartItems).values({
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
        quantity,
      });
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}
```

- [ ] Commit:
```bash
git add client/app/actions/cart.ts
git commit -m "feat(cart): accept variantId and quantity in addToCart"
```

---

### Task 2: Variant selector client component

**Files:**
- Create: `client/app/products/[id]/variant-selector.tsx`

- [ ] Create `client/app/products/[id]/variant-selector.tsx`:

```tsx
'use client';

interface Variant {
  id: string;
  name: string;
  type: string;
  priceModifier: string;
  stockQuantity: number;
  isActive: boolean;
}

interface Props {
  variants: Variant[];
  basePrice: string;
  onSelect: (variantId: string | null, finalPrice: number) => void;
}

export function VariantSelector({ variants, basePrice, onSelect }: Props) {
  if (variants.length === 0) return null;

  const types = [...new Set(variants.map((v) => v.type))];

  return (
    <div className="space-y-4">
      {types.map((type) => (
        <div key={type}>
          <p className="text-sm font-medium text-gray-700 capitalize mb-2">{type}</p>
          <div className="flex flex-wrap gap-2">
            {variants
              .filter((v) => v.type === type && v.isActive)
              .map((v) => {
                const modifier = parseFloat(v.priceModifier);
                const final = parseFloat(basePrice) + modifier;
                const label = modifier === 0
                  ? v.name
                  : modifier > 0
                  ? `${v.name} (+$${modifier.toFixed(2)})`
                  : `${v.name} (-$${Math.abs(modifier).toFixed(2)})`;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={v.stockQuantity === 0}
                    onClick={() => onSelect(v.id, final)}
                    className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {label}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/[id]/variant-selector.tsx
git commit -m "feat(client): add VariantSelector component"
```

---

### Task 3: Add to cart button client component

**Files:**
- Create: `client/app/products/[id]/add-to-cart-button.tsx`

- [ ] Create `client/app/products/[id]/add-to-cart-button.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { addToCart } from '@/app/actions/cart';

interface Props {
  productId: string;
  variantId: string | null;
  maxQuantity: number;
}

export function AddToCartButton({ productId, variantId, maxQuantity }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    startTransition(async () => {
      const result = await addToCart(productId, variantId, quantity);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-md">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          −
        </button>
        <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={isPending || maxQuantity === 0}
        onClick={handleAdd}
        className="flex-1 bg-green-600 text-white py-2 px-6 rounded-md font-medium disabled:opacity-50 hover:bg-green-700 transition-colors"
      >
        {isPending ? 'Adding…' : added ? 'Added!' : maxQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/[id]/add-to-cart-button.tsx
git commit -m "feat(client): add AddToCartButton with quantity picker"
```

---

### Task 4: Product detail page server component

**Files:**
- Create: `client/app/products/[id]/page.tsx`

- [ ] Create `client/app/products/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { ProductDetailClient } from './product-detail-client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id),
  });
  if (!product) return { title: 'Product not found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.imageUrl ? [product.imageUrl] : [] },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();

  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id),
    with: {
      category: true,
      variants: {
        where: eq(schema.productVariants.isActive, true),
        orderBy: (v, { asc }) => [asc(v.sortOrder)],
      },
    },
  });

  if (!product || !product.isActive) notFound();

  const ratings = await db.query.productRatings.findFirst({
    where: eq(schema.productRatings.productId, id),
  });

  return <ProductDetailClient product={product} ratings={ratings ?? null} />;
}
```

- [ ] Create `client/app/products/[id]/product-detail-client.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { VariantSelector } from './variant-selector';
import { AddToCartButton } from './add-to-cart-button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string;
  imageAlt: string | null;
  emoji: string | null;
  stockQuantity: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fiber: number | null;
  sugar: number | null;
  fat: number | null;
  category: { name: string };
  variants: { id: string; name: string; type: string; priceModifier: string; stockQuantity: number; isActive: boolean }[];
}

interface Props {
  product: Product;
  ratings: { averageRating: string; totalReviews: number } | null;
}

export function ProductDetailClient({ product, ratings }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState(parseFloat(product.price));

  const hasNutrition = [product.calories, product.protein, product.carbs].some((v) => v !== null);
  const stockForDisplay = selectedVariantId
    ? (product.variants.find((v) => v.id === selectedVariantId)?.stockQuantity ?? product.stockQuantity)
    : product.stockQuantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.imageUrl} alt={product.imageAlt ?? product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="text-3xl font-bold">{product.emoji} {product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-green-700">${displayPrice.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-gray-400 line-through">${parseFloat(product.compareAtPrice).toFixed(2)}</span>
            )}
          </div>

          {/* Ratings */}
          {ratings && ratings.totalReviews > 0 && (
            <a href="#reviews" className="text-sm text-gray-600 hover:underline">
              ★ {parseFloat(ratings.averageRating).toFixed(1)} ({ratings.totalReviews} reviews)
            </a>
          )}

          <p className="text-gray-700">{product.description}</p>

          <VariantSelector
            variants={product.variants}
            basePrice={product.price}
            onSelect={(vId, price) => { setSelectedVariantId(vId); setDisplayPrice(price); }}
          />

          <AddToCartButton
            productId={product.id}
            variantId={selectedVariantId}
            maxQuantity={stockForDisplay}
          />

          {/* Nutrition */}
          {hasNutrition && (
            <details className="border rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Nutrition Info</summary>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                {product.calories != null && <><dt className="text-gray-500">Calories</dt><dd className="font-medium col-span-2">{product.calories}</dd></>}
                {product.protein != null && <><dt className="text-gray-500">Protein</dt><dd className="font-medium col-span-2">{product.protein}g</dd></>}
                {product.carbs != null && <><dt className="text-gray-500">Carbs</dt><dd className="font-medium col-span-2">{product.carbs}g</dd></>}
                {product.fiber != null && <><dt className="text-gray-500">Fiber</dt><dd className="font-medium col-span-2">{product.fiber}g</dd></>}
                {product.fat != null && <><dt className="text-gray-500">Fat</dt><dd className="font-medium col-span-2">{product.fat}g</dd></>}
              </dl>
            </details>
          )}
        </div>
      </div>

      {/* Reviews section anchor */}
      <div id="reviews" className="mt-16">
        {/* Reviews UI added in plan-08 */}
      </div>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/products/[id]/
git commit -m "feat(client): add product detail page with variant selection"
```

---

### Task 5: Guest cart merge at login

**Files:**
- Modify: `client/lib/auth-client.ts`

- [ ] Replace `client/lib/auth-client.ts`:

```ts
'use client';

import { createAuthClient } from 'better-auth/react';
import { mergeGuestCart } from '@/app/actions/cart';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
  fetchOptions: {
    onSuccess: async (ctx) => {
      // Merge guest cart after sign-in
      if (ctx.response.url?.includes('/sign-in')) {
        const sessionId = document.cookie
          .split('; ')
          .find((r) => r.startsWith('cart_session_id='))
          ?.split('=')[1];
        if (sessionId) {
          const session = ctx.data as { user?: { id: string } };
          if (session?.user?.id) {
            await mergeGuestCart(session.user.id, sessionId);
          }
        }
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession, $Infer } = authClient;
```

- [ ] Commit:
```bash
git add client/lib/auth-client.ts
git commit -m "feat(client): wire guest cart merge on sign-in success"
```

---

### Task 6: Verify

- [ ] Start dev server: confirm `/products/[id]` loads with product info
- [ ] Add a product to cart as guest, log in — confirm cart items merge
- [ ] Run `bun run typecheck --filter client`
