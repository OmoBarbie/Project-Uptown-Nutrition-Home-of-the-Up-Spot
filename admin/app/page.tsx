import type { Route } from 'next';
import Link from 'next/link';
import { getDashboardData } from '@/lib/dashboard';
import { RevenueChart } from './components/revenue-chart';
import { StatusDonut } from './components/status-donut';

export default async function DashboardPage() {
  const { today, thirtyDay } = await getDashboardData();

  const statusBadgeClass = (s: string) => {
    if (['delivered','completed'].includes(s)) return 'badge badge-success';
    if (['pending','processing','preparing'].includes(s)) return 'badge badge-warning';
    if (['cancelled','refunded'].includes(s)) return 'badge badge-danger';
    if (['confirmed','ready_for_pickup'].includes(s)) return 'badge badge-blue';
    return 'badge badge-neutral';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here&apos;s what&apos;s happening today</p>
        </div>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Orders Today" value={today.ordersToday} accent />
        <StatCard label="Revenue Today" value={`$${today.revenueToday.toFixed(2)}`} accent />
        <StatCard label="Low Stock" value={today.lowStockProducts} href="/products?lowStock=1" />
        <StatCard label="New Customers" sublabel="30 days" value={thirtyDay.newCustomers} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-padded">
          <p className="section-title">Revenue — last 30 days</p>
          <RevenueChart data={thirtyDay.dailyRevenue} />
        </div>
        <div className="card-padded">
          <p className="section-title">Orders by status</p>
          <StatusDonut data={thirtyDay.orderStatusBreakdown.map((r) => ({ status: r.status, count: Number(r.count) }))} />
        </div>
      </div>

      {/* Recent orders */}
      <div className="mb-8">
        <p className="section-title">Recent orders</p>
        <div className="table-wrap">
          <div className="table-scroll">
            <table style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {today.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/orders/${o.id}`} style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td><strong>{o.customerName}</strong></td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>${o.total}</td>
                    <td><span className={statusBadgeClass(o.status)}>{o.status.replace(/_/g,' ')}</span></td>
                    <td>{o.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
                {today.recentOrders.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No orders today</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div>
        <p className="section-title">Top products — 30 days</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {thirtyDay.topProducts.map((p) => (
                <tr key={p.productId}>
                  <td><strong>{p.productName}</strong></td>
                  <td style={{ color: 'var(--orange)', fontWeight: 600 }}>{p.units}</td>
                </tr>
              ))}
              {thirtyDay.topProducts.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No sales data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href, sublabel, accent }: { label: string; value: string | number; href?: string; sublabel?: string; accent?: boolean }) {
  const content = (
    <div className="stat-card">
      <div className="stat-label">{label}{sublabel && <span style={{ fontSize: '0.65rem', marginLeft: '0.3rem', opacity: 0.7 }}>({sublabel})</span>}</div>
      <div className={`stat-value${accent ? ' stat-accent' : ''}`}>{value}</div>
    </div>
  );
  return href ? <Link href={href as Route} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}
