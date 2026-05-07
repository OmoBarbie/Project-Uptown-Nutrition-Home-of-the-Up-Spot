# Admin Users, Reviews Moderation & Audit Log Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** User management page, reviews moderation with productRatings recalculation, read-only audit log viewer.

**Architecture:** Three new route groups in admin. User management requires one schema migration (`isBanned`). Reviews moderation triggers `productRatings` recalculation on approve. Audit log is read-only with filters.

**Tech Stack:** Next.js App Router, Drizzle ORM, server actions

---

### Task 1: isBanned migration

**Files:**
- Modify: `database/src/schema/users.ts`

- [ ] Add `isBanned` to the `users` table in `database/src/schema/users.ts`:

```ts
isBanned: boolean('is_banned').notNull().default(false),
```

Add after the `avatarUrl` line.

- [ ] Run migration:
```bash
bun run db:generate
bun run db:migrate
```

- [ ] Add banned check to `client/middleware.ts` — after session token check for protected routes, add:

```ts
// This requires a DB lookup — use API route or trust session data
// Better Auth session includes custom fields via additionalFields
// Add isBanned to additionalFields in client/lib/auth.ts:
// isBanned: { type: 'boolean', required: false, defaultValue: false, input: false }
// Then in middleware, check session?.user?.isBanned
```

- [ ] Add `isBanned` to `additionalFields` in `client/lib/auth.ts`:
```ts
isBanned: {
  type: 'boolean',
  required: false,
  defaultValue: false,
  input: false,
},
```

- [ ] Commit:
```bash
git add database/src/schema/users.ts client/lib/auth.ts
git commit -m "feat(db): add isBanned column to users"
```

---

### Task 2: User management server actions

**Files:**
- Create: `admin/app/users/actions.ts`

- [ ] Create `admin/app/users/actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

export async function updateUserRole(userId: string, role: 'customer' | 'admin' | 'super_admin') {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session || session.user.role !== 'super_admin') throw new Error('Unauthorized');

  await db.update(schema.users).set({ role, updatedAt: new Date() }).where(eq(schema.users.id, userId));
  await createAuditLog(session.user.id, { action: 'update', entityType: 'user', entityId: userId, changes: { role } });
  revalidatePath('/users');
}

export async function toggleBan(userId: string, isBanned: boolean) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error('Unauthorized');

  await db.update(schema.users).set({ isBanned, updatedAt: new Date() }).where(eq(schema.users.id, userId));
  await createAuditLog(session.user.id, { action: 'update', entityType: 'user', entityId: userId, changes: { isBanned } });
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}
```

- [ ] Commit:
```bash
git add admin/app/users/actions.ts
git commit -m "feat(admin): add user management server actions"
```

---

### Task 3: User list and detail pages

**Files:**
- Create: `admin/app/users/page.tsx`
- Create: `admin/app/users/[id]/page.tsx`

- [ ] Create `admin/app/users/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { count, eq, ilike } from 'drizzle-orm';
import Link from 'next/link';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = getDb();

  const users = await db.query.users.findMany({
    where: q ? ilike(schema.users.email, `%${q}%`) : undefined,
    orderBy: (u, { desc }) => [desc(u.createdAt)],
    limit: 50,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by email…" className="border rounded-md px-3 py-2 text-sm w-72" />
        <button type="submit" className="ml-2 bg-gray-100 px-3 py-2 rounded-md text-sm">Search</button>
      </form>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Email</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Joined</th>
            <th className="pb-2">Status</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-3">{u.email}</td>
              <td className="py-3">{u.name}</td>
              <td className="py-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{u.role}</span>
              </td>
              <td className="py-3 text-gray-500">{u.createdAt.toLocaleDateString()}</td>
              <td className="py-3">{u.isBanned ? <span className="text-red-600 text-xs">Banned</span> : <span className="text-green-600 text-xs">Active</span>}</td>
              <td className="py-3"><Link href={`/users/${u.id}`} className="text-blue-600 hover:underline">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] Create `admin/app/users/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { updateUserRole, toggleBan } from '../actions';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const user = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  if (!user) notFound();

  const orders = await db.query.orders.findMany({
    where: eq(schema.orders.userId, id),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    limit: 10,
  });

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-500 mb-6">{user.email}</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Role</p>
          <form action={updateUserRole.bind(null, user.id, 'customer')}>
            <select name="role" defaultValue={user.role} onChange={(e) => e.target.form?.requestSubmit()} className="border rounded-md px-2 py-1 text-sm">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </form>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Account Status</p>
          <form action={toggleBan.bind(null, user.id, !user.isBanned)}>
            <button type="submit" className={`text-sm px-3 py-1 rounded-md ${user.isBanned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {user.isBanned ? 'Unban User' : 'Ban User'}
            </button>
          </form>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="pb-2">Order #</th><th className="pb-2">Total</th><th className="pb-2">Status</th><th className="pb-2">Date</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2">{o.orderNumber}</td>
                <td className="py-2">${o.total}</td>
                <td className="py-2">{o.status}</td>
                <td className="py-2 text-gray-500">{o.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

- [ ] Add users link to `admin/components/AdminLayout.tsx` sidebar.

- [ ] Commit:
```bash
git add admin/app/users/
git commit -m "feat(admin): add user management pages"
```

---

### Task 4: Reviews moderation server actions

**Files:**
- Create: `admin/app/reviews/actions.ts`

- [ ] Create `admin/app/reviews/actions.ts`:

```ts
'use server';

import { getDb, schema } from '@tayo/database';
import { eq, and, count, avg, sum, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function recalculateProductRatings(productId: string) {
  const db = getDb();
  const approved = await db.query.reviews.findMany({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.isApproved, true)),
    columns: { rating: true },
  });

  if (approved.length === 0) {
    await db.delete(schema.productRatings).where(eq(schema.productRatings.productId, productId));
    return;
  }

  const total = approved.length;
  const average = approved.reduce((sum, r) => sum + r.rating, 0) / total;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  for (const r of approved) counts[r.rating] = (counts[r.rating] ?? 0) + 1;

  await db.insert(schema.productRatings).values({
    productId,
    averageRating: average.toFixed(2),
    totalReviews: total,
    oneStar: counts[1],
    twoStar: counts[2],
    threeStar: counts[3],
    fourStar: counts[4],
    fiveStar: counts[5],
  }).onConflictDoUpdate({
    target: schema.productRatings.productId,
    set: { averageRating: average.toFixed(2), totalReviews: total, oneStar: counts[1], twoStar: counts[2], threeStar: counts[3], fourStar: counts[4], fiveStar: counts[5], updatedAt: new Date() },
  });
}

export async function approveReview(reviewId: string) {
  const db = getDb();
  const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, reviewId) });
  if (!review) return;
  await db.update(schema.reviews).set({ isApproved: true, updatedAt: new Date() }).where(eq(schema.reviews.id, reviewId));
  await recalculateProductRatings(review.productId);
  revalidatePath('/reviews');
}

export async function rejectReview(reviewId: string) {
  const db = getDb();
  const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, reviewId) });
  if (!review) return;
  await db.delete(schema.reviews).where(eq(schema.reviews.id, reviewId));
  await recalculateProductRatings(review.productId);
  revalidatePath('/reviews');
}

export async function featureReview(reviewId: string, isFeatured: boolean) {
  const db = getDb();
  await db.update(schema.reviews).set({ isFeatured, updatedAt: new Date() }).where(eq(schema.reviews.id, reviewId));
  revalidatePath('/reviews');
}

export async function bulkApproveReviews(reviewIds: string[]) {
  const db = getDb();
  for (const id of reviewIds) {
    const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, id) });
    if (!review) continue;
    await db.update(schema.reviews).set({ isApproved: true, updatedAt: new Date() }).where(eq(schema.reviews.id, id));
    await recalculateProductRatings(review.productId);
  }
  revalidatePath('/reviews');
}
```

- [ ] Commit:
```bash
git add admin/app/reviews/actions.ts
git commit -m "feat(admin): add reviews moderation actions with rating recalculation"
```

---

### Task 5: Reviews moderation page

**Files:**
- Create: `admin/app/reviews/page.tsx`

- [ ] Create `admin/app/reviews/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { approveReview, rejectReview, featureReview } from './actions';

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = 'pending' } = await searchParams;
  const db = getDb();

  const reviews = await db.query.reviews.findMany({
    where: tab === 'pending' ? eq(schema.reviews.isApproved, false) : tab === 'approved' ? eq(schema.reviews.isApproved, true) : undefined,
    with: { product: { columns: { name: true } } },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    limit: 50,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'all'].map((t) => (
          <a key={t} href={`/reviews?tab=${t}`} className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize ${tab === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{t}</a>
        ))}
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{r.product.name}</p>
                <p className="text-sm text-gray-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} {r.isVerifiedPurchase && <span className="text-green-600 text-xs ml-1">Verified</span>}</p>
                {r.title && <p className="font-medium mt-1">{r.title}</p>}
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {!r.isApproved && (
                  <form action={approveReview.bind(null, r.id)}>
                    <button type="submit" className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                  </form>
                )}
                <form action={rejectReview.bind(null, r.id)}>
                  <button type="submit" className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded" onClick={(e) => { if (!confirm('Delete review?')) e.preventDefault(); }}>Reject</button>
                </form>
                <form action={featureReview.bind(null, r.id, !r.isFeatured)}>
                  <button type="submit" className={`text-sm px-2 py-1 rounded ${r.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                    {r.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">No reviews in this tab.</p>}
      </div>
    </div>
  );
}
```

- [ ] Add reviews link to `admin/components/AdminLayout.tsx` sidebar.

- [ ] Commit:
```bash
git add admin/app/reviews/page.tsx
git commit -m "feat(admin): add reviews moderation page"
```

---

### Task 6: Audit log viewer

**Files:**
- Create: `admin/app/audit-logs/page.tsx`

- [ ] Create `admin/app/audit-logs/page.tsx`:

```tsx
import { getDb, schema } from '@tayo/database';
import { eq, and, gte, lte } from 'drizzle-orm';

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<{ entity?: string; from?: string; to?: string }> }) {
  const { entity, from, to } = await searchParams;
  const db = getDb();

  const logs = await db.query.auditLogs.findMany({
    where: and(
      entity ? eq(schema.auditLogs.entityType, entity as 'product' | 'order' | 'user' | 'category') : undefined,
      from ? gte(schema.auditLogs.createdAt, new Date(from)) : undefined,
      to ? lte(schema.auditLogs.createdAt, new Date(to)) : undefined,
    ),
    orderBy: (l, { desc }) => [desc(l.createdAt)],
    limit: 100,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      <form className="flex gap-3 mb-6 flex-wrap">
        <select name="entity" defaultValue={entity} className="border rounded-md px-2 py-1.5 text-sm">
          <option value="">All entities</option>
          {['product', 'order', 'user', 'category'].map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <input type="date" name="from" defaultValue={from} className="border rounded-md px-2 py-1.5 text-sm" />
        <input type="date" name="to" defaultValue={to} className="border rounded-md px-2 py-1.5 text-sm" />
        <button type="submit" className="bg-gray-100 px-3 py-1.5 rounded-md text-sm">Filter</button>
      </form>
      <div className="space-y-2">
        {logs.map((log) => (
          <details key={log.id} className="border rounded-lg">
            <summary className="p-3 cursor-pointer flex items-center gap-3 text-sm">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.action === 'create' ? 'bg-green-100 text-green-700' : log.action === 'delete' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {log.action}
              </span>
              <span className="font-medium">{log.entityType}</span>
              <span className="text-gray-500">{log.entityId}</span>
              <span className="text-gray-400 ml-auto">{log.createdAt.toLocaleString()}</span>
            </summary>
            <div className="px-3 pb-3">
              <pre className="bg-gray-50 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(log.changes, null, 2)}</pre>
            </div>
          </details>
        ))}
        {logs.length === 0 && <p className="text-gray-500">No logs found.</p>}
      </div>
    </div>
  );
}
```

- [ ] Add audit-logs link to `admin/components/AdminLayout.tsx` sidebar.

- [ ] Commit:
```bash
git add admin/app/audit-logs/page.tsx
git commit -m "feat(admin): add audit log viewer"
```
