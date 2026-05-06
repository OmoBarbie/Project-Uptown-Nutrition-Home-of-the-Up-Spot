# Admin Categories & Product Variants Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Add categories CRUD pages to admin and add a variants section to the product form.

**Architecture:** New `/categories` route group in admin with server actions. Product form gains a dynamic variants list managed in React state, saved alongside the product.

**Tech Stack:** Next.js App Router, Drizzle ORM, server actions, existing admin patterns

---

### Task 1: Categories server actions

**Files:**
- Create: `admin/app/categories/actions.ts`

- [ ] Create `admin/app/categories/actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createCategory(formData: FormData) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  const name = (formData.get('name') as string).trim();
  const slug = (formData.get('slug') as string).trim() || slugify(name);
  const description = formData.get('description') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'on';

  const [category] = await db.insert(schema.categories).values({
    name, slug, description, imageUrl, sortOrder, isActive,
  }).returning();

  await createAuditLog(session.user.id, {
    action: 'create', entityType: 'category', entityId: category.id, changes: { name },
  });

  revalidatePath('/categories');
  redirect('/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  const name = (formData.get('name') as string).trim();
  const slug = (formData.get('slug') as string).trim() || slugify(name);
  const description = formData.get('description') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'on';

  await db.update(schema.categories)
    .set({ name, slug, description, imageUrl, sortOrder, isActive, updatedAt: new Date() })
    .where(eq(schema.categories.id, id));

  await createAuditLog(session.user.id, {
    action: 'update', entityType: 'category', entityId: id, changes: { name, slug, isActive },
  });

  revalidatePath('/categories');
  redirect('/categories');
}

export async function deleteCategory(id: string) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  // Check if any products reference this category
  const products = await db.query.products.findMany({
    where: eq(schema.products.categoryId, id),
    columns: { id: true },
  });

  if (products.length > 0) {
    // Soft delete — deactivate only
    await db.update(schema.categories).set({ isActive: false }).where(eq(schema.categories.id, id));
  } else {
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
  }

  await createAuditLog(session.user.id, {
    action: 'delete', entityType: 'category', entityId: id, changes: {},
  });

  revalidatePath('/categories');
}
```

- [ ] Commit:
```bash
git add admin/app/categories/actions.ts
git commit -m "feat(admin): add category server actions"
```

---

### Task 2: Category form component

**Files:**
- Create: `admin/app/categories/category-form.tsx`

- [ ] Create `admin/app/categories/category-form.tsx`:

```tsx
'use client';

import { useActionState, useState } from 'react';
import { createCategory, updateCategory } from './actions';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface Props {
  category?: Category;
}

export function CategoryForm({ category }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!category) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
          }}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" defaultValue={category?.description ?? ''} rows={3} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input name="imageUrl" type="url" defaultValue={category?.imageUrl ?? ''} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sort Order</label>
        <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div className="flex items-center gap-2">
        <input name="isActive" type="checkbox" id="isActive" defaultChecked={category?.isActive ?? true} />
        <label htmlFor="isActive" className="text-sm font-medium">Active</label>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium">
        {category ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  );
}
```

- [ ] Commit:
```bash
git add admin/app/categories/category-form.tsx
git commit -m "feat(admin): add CategoryForm component"
```

---

### Task 3: Category list page

**Files:**
- Create: `admin/app/categories/page.tsx`

- [ ] Create `admin/app/categories/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { deleteCategory } from './actions';

export default async function CategoriesPage() {
  const db = getDb();
  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });

  const productCounts = await Promise.all(
    categories.map(async (c) => {
      const [result] = await db.select({ count: count() }).from(schema.products).where(eq(schema.products.categoryId, c.id));
      return { id: c.id, count: result.count };
    })
  );

  const countMap = Object.fromEntries(productCounts.map((r) => [r.id, r.count]));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/categories/new" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          New Category
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Name</th>
            <th className="pb-2">Slug</th>
            <th className="pb-2">Products</th>
            <th className="pb-2">Order</th>
            <th className="pb-2">Active</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-3 font-medium">{c.name}</td>
              <td className="py-3 text-gray-500">{c.slug}</td>
              <td className="py-3">{countMap[c.id] ?? 0}</td>
              <td className="py-3">{c.sortOrder}</td>
              <td className="py-3">{c.isActive ? '✓' : '—'}</td>
              <td className="py-3 flex gap-3">
                <Link href={`/categories/${c.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <form action={deleteCategory.bind(null, c.id)}>
                  <button type="submit" className="text-red-600 hover:underline" onClick={(e) => { if (!confirm('Delete category?')) e.preventDefault(); }}>
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] Create `admin/app/categories/new/page.tsx`:

```tsx
import { CategoryForm } from '../category-form';

export default function NewCategoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Category</h1>
      <CategoryForm />
    </div>
  );
}
```

- [ ] Create `admin/app/categories/[id]/edit/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { CategoryForm } from '../../category-form';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const category = await db.query.categories.findFirst({ where: eq(schema.categories.id, id) });
  if (!category) notFound();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
```

- [ ] Add categories link to `admin/components/AdminLayout.tsx` sidebar navigation.

- [ ] Commit:
```bash
git add admin/app/categories/
git commit -m "feat(admin): add categories list, new, and edit pages"
```

---

### Task 4: Product variants UI in product form

**Files:**
- Modify: `admin/app/products/product-form.tsx`
- Modify: `admin/app/products/actions.ts`

- [ ] Create `admin/app/products/variants-editor.tsx`:

```tsx
'use client';

import { useState } from 'react';

interface Variant {
  id?: string;
  name: string;
  type: string;
  priceModifier: string;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  initial: Variant[];
}

export function VariantsEditor({ initial }: Props) {
  const [variants, setVariants] = useState<Variant[]>(initial);

  function add() {
    setVariants((v) => [...v, { name: '', type: 'size', priceModifier: '0', stockQuantity: 0, isActive: true, sortOrder: v.length }]);
  }

  function remove(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof Variant, value: string | number | boolean) {
    setVariants((v) => v.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Variants</h3>
        <button type="button" onClick={add} className="text-sm text-green-600 hover:underline">+ Add variant</button>
      </div>
      {/* Hidden input to pass variants as JSON */}
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      {variants.map((v, i) => (
        <div key={i} className="grid grid-cols-5 gap-2 items-end border rounded-md p-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input value={v.name} onChange={(e) => update(i, 'name', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Type</label>
            <select value={v.type} onChange={(e) => update(i, 'type', e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
              <option value="size">Size</option>
              <option value="flavor">Flavor</option>
              <option value="option">Option</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Price ±</label>
            <input type="number" step="0.01" value={v.priceModifier} onChange={(e) => update(i, 'priceModifier', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Stock</label>
            <input type="number" min="0" value={v.stockQuantity} onChange={(e) => update(i, 'stockQuantity', parseInt(e.target.value))} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <button type="button" onClick={() => remove(i)} className="text-red-500 text-sm hover:underline">Remove</button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] In `admin/app/products/product-form.tsx`, import `VariantsEditor` and add it to the form below the main fields. Pass `initial={product?.variants ?? []}`.

- [ ] In `admin/app/products/actions.ts`, inside `createProduct` and `updateProduct`, parse the `variants` JSON from formData and upsert them:

```ts
const variantsRaw = formData.get('variants') as string;
const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

// After product insert/update, upsert variants:
if (variants.length > 0) {
  // Delete removed variants (for update case)
  if (productId) {
    const incomingIds = variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id);
    const existing = await db.query.productVariants.findMany({ where: eq(schema.productVariants.productId, productId) });
    for (const ev of existing) {
      if (!incomingIds.includes(ev.id)) {
        await db.delete(schema.productVariants).where(eq(schema.productVariants.id, ev.id));
      }
    }
  }
  for (const v of variants) {
    if (v.id) {
      await db.update(schema.productVariants).set({ name: v.name, type: v.type, priceModifier: v.priceModifier, stockQuantity: v.stockQuantity, isActive: v.isActive, sortOrder: v.sortOrder, updatedAt: new Date() }).where(eq(schema.productVariants.id, v.id));
    } else {
      await db.insert(schema.productVariants).values({ productId: product.id, name: v.name, type: v.type, priceModifier: v.priceModifier, stockQuantity: v.stockQuantity, isActive: v.isActive, sortOrder: v.sortOrder });
    }
  }
}
```

- [ ] Commit:
```bash
git add admin/app/products/variants-editor.tsx admin/app/products/product-form.tsx admin/app/products/actions.ts
git commit -m "feat(admin): add product variants editor to product form"
```
