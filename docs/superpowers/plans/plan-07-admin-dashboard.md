# Admin Dashboard Analytics Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Replace the admin dashboard placeholder with real analytics — today snapshot + 30-day charts.

**Architecture:** Dashboard page is a server component running parallel DB queries. Charts use `recharts` (client component island). No caching — data is fresh on each load.

**Tech Stack:** Next.js App Router, Drizzle ORM, `recharts`, TypeScript

---

### Task 1: Install recharts

**Files:**
- Modify: `admin/package.json`

- [ ] Add to `admin/package.json` dependencies:
```json
"recharts": "^2.15.0"
```

- [ ] Run: `bun install`

- [ ] Commit:
```bash
git add admin/package.json bun.lock
git commit -m "chore(admin): add recharts for dashboard charts"
```

---

### Task 2: Dashboard data queries

**Files:**
- Create: `admin/lib/dashboard.ts`

- [ ] Create `admin/lib/dashboard.ts`:

```ts
import { getDb, schema } from '@tayo/database';
import { eq, gte, and, sql, count, sum, desc } from 'drizzle-orm';

export async function getDashboardData() {
  const db = getDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    ordersToday,
    revenueToday,
    lowStockProducts,
    recentOrders,
    dailyRevenue,
    orderStatusBreakdown,
    topProducts,
    newCustomers,
  ] = await Promise.all([
    // Orders today count
    db.select({ count: count() }).from(schema.orders)
      .where(and(gte(schema.orders.createdAt, todayStart), sql`${schema.orders.status} != 'cancelled'`))
      .then(([r]) => r.count),

    // Revenue today
    db.select({ total: sum(schema.orders.total) }).from(schema.orders)
      .where(and(gte(schema.orders.createdAt, todayStart), sql`${schema.orders.paymentStatus} = 'succeeded'`))
      .then(([r]) => parseFloat(r.total ?? '0')),

    // Low stock (< 10)
    db.select({ count: count() }).from(schema.products)
      .where(and(eq(schema.products.isActive, true), sql`${schema.products.stockQuantity} < 10`))
      .then(([r]) => r.count),

    // Recent 5 orders
    db.query.orders.findMany({
      orderBy: desc(schema.orders.createdAt),
      limit: 5,
      columns: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
    }),

    // Daily revenue last 30 days
    db.select({
      date: sql<string>`DATE(${schema.orders.createdAt})`.as('date'),
      revenue: sum(schema.orders.total).as('revenue'),
    })
      .from(schema.orders)
      .where(and(gte(schema.orders.createdAt, thirtyDaysAgo), sql`${schema.orders.paymentStatus} = 'succeeded'`))
      .groupBy(sql`DATE(${schema.orders.createdAt})`)
      .orderBy(sql`DATE(${schema.orders.createdAt})`),

    // Order status breakdown
    db.select({ status: schema.orders.status, count: count() })
      .from(schema.orders)
      .where(gte(schema.orders.createdAt, thirtyDaysAgo))
      .groupBy(schema.orders.status),

    // Top 5 products by units sold (last 30 days)
    db.select({
      productId: schema.orderItems.productId,
      productName: schema.orderItems.productName,
      units: sum(schema.orderItems.quantity).as('units'),
    })
      .from(schema.orderItems)
      .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
      .where(gte(schema.orders.createdAt, thirtyDaysAgo))
      .groupBy(schema.orderItems.productId, schema.orderItems.productName)
      .orderBy(desc(sql`units`))
      .limit(5),

    // New customers last 30 days
    db.select({ count: count() }).from(schema.users)
      .where(and(eq(schema.users.role, 'customer'), gte(schema.users.createdAt, thirtyDaysAgo)))
      .then(([r]) => r.count),
  ]);

  return {
    today: { ordersToday, revenueToday, lowStockProducts, recentOrders },
    thirtyDay: { dailyRevenue, orderStatusBreakdown, topProducts, newCustomers },
  };
}
```

- [ ] Commit:
```bash
git add admin/lib/dashboard.ts
git commit -m "feat(admin): add dashboard data query helpers"
```

---

### Task 3: Revenue chart client component

**Files:**
- Create: `admin/app/components/revenue-chart.tsx`

- [ ] Create `admin/app/components/revenue-chart.tsx`:

```tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { date: string; revenue: string | null }[];
}

export function RevenueChart({ data }: Props) {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(d.revenue ?? '0'),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']} />
        <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

- [ ] Create `admin/app/components/status-donut.tsx`:

```tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS: Record<string, string> = {
  pending: '#fbbf24', confirmed: '#60a5fa', preparing: '#a78bfa',
  ready_for_pickup: '#34d399', out_for_delivery: '#f97316',
  delivered: '#10b981', completed: '#16a34a', cancelled: '#f87171', refunded: '#94a3b8',
};

interface Props {
  data: { status: string; count: number }[];
}

export function StatusDonut({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80}>
          {data.map((entry) => <Cell key={entry.status} fill={COLORS[entry.status] ?? '#94a3b8'} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

- [ ] Commit:
```bash
git add admin/app/components/revenue-chart.tsx admin/app/components/status-donut.tsx
git commit -m "feat(admin): add recharts dashboard components"
```

---

### Task 4: Dashboard page

**Files:**
- Modify: `admin/app/page.tsx`

- [ ] Replace contents of `admin/app/page.tsx`:

```tsx
import Link from 'next/link';
import { getDashboardData } from '@/lib/dashboard';
import { RevenueChart } from './components/revenue-chart';
import { StatusDonut } from './components/status-donut';

export default async function DashboardPage() {
  const { today, thirtyDay } = await getDashboardData();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Today snapshot */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Today</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Orders Today" value={today.ordersToday} />
          <StatCard label="Revenue Today" value={`$${today.revenueToday.toFixed(2)}`} />
          <StatCard label="Low Stock" value={today.lowStockProducts} href="/products?lowStock=1" />
          <StatCard label="New Customers (30d)" value={thirtyDay.newCustomers} />
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="pb-2">Order #</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th></tr></thead>
          <tbody>
            {today.recentOrders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2"><Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline">{o.orderNumber}</Link></td>
                <td className="py-2">{o.customerName}</td>
                <td className="py-2">${o.total}</td>
                <td className="py-2 capitalize">{o.status.replace(/_/g, ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 30-day charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Revenue (30 days)</h3>
          <RevenueChart data={thirtyDay.dailyRevenue} />
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Orders by Status</h3>
          <StatusDonut data={thirtyDay.orderStatusBreakdown.map((r) => ({ status: r.status, count: Number(r.count) }))} />
        </div>
      </section>

      {/* Top products */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Top Products (30 days)</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="pb-2">Product</th><th className="pb-2">Units Sold</th></tr></thead>
          <tbody>
            {thirtyDay.topProducts.map((p) => (
              <tr key={p.productId} className="border-b">
                <td className="py-2">{p.productName}</td>
                <td className="py-2">{p.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const content = (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
```

- [ ] Commit:
```bash
git add admin/app/page.tsx admin/app/components/
git commit -m "feat(admin): build out dashboard with analytics"
```

---

### Task 5: Verify

- [ ] Run `bun run build --filter admin` — no type errors
- [ ] Start admin dev server, confirm charts render and stat cards show real data
