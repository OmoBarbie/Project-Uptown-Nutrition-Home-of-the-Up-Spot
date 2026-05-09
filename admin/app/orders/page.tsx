import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import { desc } from 'drizzle-orm';

async function getOrders() {
  const db = getDb();
  return db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'badge badge-warning',
    confirmed: 'badge badge-blue',
    preparing: 'badge badge-purple',
    ready_for_pickup: 'badge badge-blue',
    out_for_delivery: 'badge badge-blue',
    delivered: 'badge badge-success',
    completed: 'badge badge-neutral',
    cancelled: 'badge badge-danger',
    refunded: 'badge badge-orange',
  };
  return map[status] ?? 'badge badge-neutral';
}

function paymentBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'badge badge-warning',
    processing: 'badge badge-blue',
    succeeded: 'badge badge-success',
    failed: 'badge badge-danger',
    refunded: 'badge badge-orange',
  };
  return map[status] ?? 'badge badge-neutral';
}

export default async function OrdersPage() {
  const orders = await getOrders();

  const fmt = (d: Date) => new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(d));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table style={{ minWidth: 860 }}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.orderNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{fmt(order.createdAt)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>${parseFloat(order.total).toFixed(2)}</td>
                  <td><span className={paymentBadge(order.paymentStatus)}>{order.paymentStatus}</span></td>
                  <td><span className={statusBadge(order.status)}>{order.status.replace(/_/g, ' ')}</span></td>
                  <td>
                    <Link href={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                      <EyeIcon style={{ width: 14, height: 14 }} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
