import { getDb, schema } from '@tayo/database';
import { sql } from 'drizzle-orm';
import { ShoppingBagIcon, CubeIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

async function getDashboardStats() {
  const db = getDb();

  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.products);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users);

  const [revenueResult] = await db.select({
    total: sql<string>`COALESCE(SUM(CAST(${schema.orders.total} AS NUMERIC)), 0)`
  }).from(schema.orders).where(sql`${schema.orders.paymentStatus} = 'succeeded'`);

  return {
    products: Number(productCount.count),
    orders: Number(orderCount.count),
    users: Number(userCount.count),
    revenue: parseFloat(revenueResult.total || '0'),
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
    },
    {
      name: 'Total Orders',
      value: stats.orders.toString(),
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Products',
      value: stats.products.toString(),
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Users',
      value: stats.users.toString(),
      icon: UsersIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome to your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-slate-500">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-semibold text-slate-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/products/new"
              className="block w-full rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add New Product
            </a>
            <a
              href="/orders"
              className="block w-full rounded-md bg-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-slate-300"
            >
              View All Orders
            </a>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Database</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Payment Gateway</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
