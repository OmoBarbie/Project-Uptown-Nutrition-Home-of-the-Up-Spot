import Link from 'next/link';
import { getDashboardData } from '@/lib/dashboard';
import { RevenueChart } from './components/revenue-chart';
import { StatusDonut } from './components/status-donut';

export default async function DashboardPage() {
  const { today, thirtyDay } = await getDashboardData();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Today</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Orders Today" value={today.ordersToday} />
          <StatCard label="Revenue Today" value={`$${today.revenueToday.toFixed(2)}`} />
          <StatCard label="Low Stock" value={today.lowStockProducts} href="/products?lowStock=1" />
          <StatCard label="New Customers (30d)" value={thirtyDay.newCustomers} />
        </div>
      </section>

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return href ? <Link href={href as any}>{content}</Link> : content;
}
