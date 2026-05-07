# Coupons & Order Refunds Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.
> **Depends on:** plan-01-email-package (for refund notification email)

**Goal:** Simple coupon code system (flat/percentage) in checkout + admin; full order refunds with reason from admin.

**Architecture:** New `coupons` DB table. Client checkout gets a coupon input that validates and applies discount before PaymentIntent creation. Admin gets a `/coupons` management page and a refund button on order detail.

**Tech Stack:** Drizzle ORM, Stripe, `@tayo/email`, Next.js server actions

---

### Task 1: Coupons DB schema

**Files:**
- Modify: `database/src/schema/orders.ts` (or create `database/src/schema/coupons.ts`)
- Modify: `database/src/schema/index.ts`

- [ ] Create `database/src/schema/coupons.ts`:

```ts
import { pgTable, varchar, text, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
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
```

- [ ] Add to `database/src/schema/index.ts`:
```ts
export * from './coupons';
```

- [ ] Run migration:
```bash
bun run db:generate
bun run db:migrate
```

- [ ] Commit:
```bash
git add database/src/schema/coupons.ts database/src/schema/index.ts
git commit -m "feat(db): add coupons table"
```

---

### Task 2: Coupon validation server action

**Files:**
- Create: `client/app/checkout/coupon-actions.ts`

- [ ] Create `client/app/checkout/coupon-actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';

export async function applyCoupon(code: string, subtotal: number): Promise<
  { discount: number; couponCode: string; type: string; value: string } | { error: string }
> {
  if (!code.trim()) return { error: 'Please enter a coupon code' };

  const db = getDb();
  const coupon = await db.query.coupons.findFirst({
    where: eq(schema.coupons.code, code.toUpperCase().trim()),
  });

  if (!coupon) return { error: 'Invalid coupon code' };
  if (!coupon.isActive) return { error: 'This coupon is no longer active' };

  const value = parseFloat(coupon.value);
  const discount = coupon.type === 'percentage'
    ? Math.min(subtotal * (value / 100), subtotal)
    : Math.min(value, subtotal);

  return {
    discount: Math.round(discount * 100) / 100,
    couponCode: coupon.code,
    type: coupon.type,
    value: coupon.value,
  };
}
```

- [ ] Commit:
```bash
git add client/app/checkout/coupon-actions.ts
git commit -m "feat(client): add coupon validation server action"
```

---

### Task 3: Coupon input in checkout

**Files:**
- Create: `client/app/checkout/coupon-input.tsx`
- Modify: `client/app/checkout/checkout-form.tsx`

- [ ] Create `client/app/checkout/coupon-input.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { applyCoupon } from './coupon-actions';

interface Props {
  subtotal: number;
  onApply: (discount: number, code: string) => void;
}

export function CouponInput({ subtotal, onApply }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [applied, setApplied] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    if (!code.trim()) return;
    setError('');
    startTransition(async () => {
      const result = await applyCoupon(code, subtotal);
      if ('error' in result) { setError(result.error); return; }
      setApplied(`${result.couponCode} — ${result.type === 'percentage' ? `${result.value}% off` : `$${result.value} off`}`);
      onApply(result.discount, result.couponCode);
    });
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm">
        <span className="text-green-700">{applied}</span>
        <button onClick={() => { setApplied(''); onApply(0, ''); }} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 border rounded-md px-3 py-2 text-sm uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending}
          className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
        >
          {isPending ? '…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
```

- [ ] In `client/app/checkout/checkout-form.tsx`:
  1. Add state: `const [discount, setDiscount] = useState(0); const [couponCode, setCouponCode] = useState('');`
  2. Add `<CouponInput subtotal={subtotal} onApply={(d, c) => { setDiscount(d); setCouponCode(c); }} />` above the order summary
  3. Pass `couponCode` and `discount` to `createPaymentIntent` action
  4. Display discount line in order summary: `{discount > 0 && <div>Coupon discount: -${discount.toFixed(2)}</div>}`

- [ ] Update `client/app/checkout/actions.ts` `createPaymentIntent` to accept and apply discount:

```ts
// In createPaymentIntent, subtract discount from amount before Stripe call:
const finalAmount = Math.max(0, totalInCents - Math.round(discount * 100));
// Pass couponCode when creating order, store in orders.discount field
```

- [ ] Commit:
```bash
git add client/app/checkout/coupon-input.tsx client/app/checkout/checkout-form.tsx client/app/checkout/actions.ts
git commit -m "feat(client): add coupon code input to checkout"
```

---

### Task 4: Admin coupon management pages

**Files:**
- Create: `admin/app/coupons/actions.ts`
- Create: `admin/app/coupons/page.tsx`
- Create: `admin/app/coupons/new/page.tsx`

- [ ] Create `admin/app/coupons/actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCoupon(formData: FormData) {
  const db = getDb();
  const code = (formData.get('code') as string).toUpperCase().trim();
  const type = formData.get('type') as 'flat' | 'percentage';
  const value = formData.get('value') as string;

  if (!code || !type || !value) throw new Error('All fields required');

  await db.insert(schema.coupons).values({ code, type, value, isActive: true });
  revalidatePath('/coupons');
  redirect('/coupons');
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const db = getDb();
  await db.update(schema.coupons).set({ isActive, updatedAt: new Date() }).where(eq(schema.coupons.id, id));
  revalidatePath('/coupons');
}
```

- [ ] Create `admin/app/coupons/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { toggleCoupon } from './actions';

export default async function CouponsPage() {
  const db = getDb();
  const coupons = await db.query.coupons.findMany({ orderBy: (c, { desc }) => [desc(c.createdAt)] });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Link href="/coupons/new" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">New Coupon</Link>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left"><th className="pb-2">Code</th><th className="pb-2">Type</th><th className="pb-2">Value</th><th className="pb-2">Status</th><th className="pb-2"></th></tr></thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-3 font-mono font-medium">{c.code}</td>
              <td className="py-3 capitalize">{c.type}</td>
              <td className="py-3">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
              <td className="py-3">{c.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
              <td className="py-3">
                <form action={toggleCoupon.bind(null, c.id, !c.isActive)}>
                  <button type="submit" className="text-sm text-blue-600 hover:underline">{c.isActive ? 'Deactivate' : 'Activate'}</button>
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

- [ ] Create `admin/app/coupons/new/page.tsx`:

```tsx
import { createCoupon } from '../actions';

export default function NewCouponPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Coupon</h1>
      <form action={createCoupon} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input name="code" required className="w-full border rounded-md px-3 py-2 uppercase" placeholder="SAVE10" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" required className="w-full border rounded-md px-3 py-2">
            <option value="flat">Flat ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Value</label>
          <input name="value" type="number" step="0.01" min="0.01" required className="w-full border rounded-md px-3 py-2" placeholder="10" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium">Create Coupon</button>
      </form>
    </div>
  );
}
```

- [ ] Add coupons link to `admin/components/AdminLayout.tsx` sidebar.

- [ ] Commit:
```bash
git add admin/app/coupons/
git commit -m "feat(admin): add coupon management pages"
```

---

### Task 5: Order refund in admin

**Files:**
- Create: `admin/app/orders/[id]/refund-button.tsx`
- Modify: `admin/app/orders/[id]/page.tsx`
- Create: `admin/app/orders/[id]/refund-action.ts`

- [ ] Create `admin/app/orders/[id]/refund-action.ts`:

```ts
'use server';

import Stripe from 'stripe';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';
import { sendRefundNotification } from '@tayo/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function refundOrder(orderId: string, reason: 'duplicate' | 'fraudulent' | 'customer_request' | 'other') {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error('Unauthorized');

  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
  if (!order) throw new Error('Order not found');
  if (order.paymentStatus !== 'succeeded') throw new Error('Order is not eligible for refund');
  if (!order.paymentIntentId) throw new Error('No payment intent found');

  // Process Stripe refund
  await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    reason: reason === 'customer_request' ? undefined : reason as Stripe.RefundCreateParams.Reason,
  });

  // Update order
  await db.update(schema.orders)
    .set({ paymentStatus: 'refunded', status: 'refunded', updatedAt: new Date() })
    .where(eq(schema.orders.id, orderId));

  // Audit log
  await createAuditLog(session.user.id, {
    action: 'update',
    entityType: 'order',
    entityId: orderId,
    changes: { status: 'refunded', paymentStatus: 'refunded' },
    metadata: { refundReason: reason },
  });

  // Send email
  if (order.customerEmail) {
    await sendRefundNotification(order.customerEmail, order.orderNumber, order.total, reason);
  }

  revalidatePath(`/orders/${orderId}`);
}
```

- [ ] Create `admin/app/orders/[id]/refund-button.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { refundOrder } from './refund-action';

export function RefundButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<'duplicate' | 'fraudulent' | 'customer_request' | 'other'>('customer_request');
  const [isPending, startTransition] = useTransition();

  function handleRefund() {
    startTransition(async () => {
      await refundOrder(orderId, reason);
      setOpen(false);
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200">
        Refund Order
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Refund</h2>
            <p className="text-sm text-gray-600 mb-4">This will process a full refund via Stripe and cannot be undone.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason</label>
              <select value={reason} onChange={(e) => setReason(e.target.value as typeof reason)} className="w-full border rounded-md px-3 py-2 text-sm">
                <option value="customer_request">Customer request</option>
                <option value="duplicate">Duplicate order</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 border rounded-md py-2 text-sm">Cancel</button>
              <button onClick={handleRefund} disabled={isPending} className="flex-1 bg-red-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50">
                {isPending ? 'Processing…' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] In `admin/app/orders/[id]/page.tsx`, import `RefundButton` and render it when `order.paymentStatus === 'succeeded'`:

```tsx
import { RefundButton } from './refund-button';

// In the page JSX, near order status:
{order.paymentStatus === 'succeeded' && order.status !== 'refunded' && (
  <RefundButton orderId={order.id} />
)}
```

- [ ] Commit:
```bash
git add admin/app/orders/[id]/refund-action.ts admin/app/orders/[id]/refund-button.tsx admin/app/orders/[id]/page.tsx
git commit -m "feat(admin): add order refund with Stripe and audit log"
```
