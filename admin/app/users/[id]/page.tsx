import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { updateUserRole, toggleBan } from '../actions';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

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
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/users" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14 }} />
          Back to Users
        </Link>
        <h1 className="page-title">{user.name}</h1>
        <p className="page-subtitle">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card-padded">
          <p className="section-title">Role</p>
          <form action={updateUserRole.bind(null, user.id)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <select name="role" defaultValue={user.role ?? 'customer'}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Update</button>
          </form>
        </div>
        <div className="card-padded">
          <p className="section-title">Account Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge ${user.isBanned ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
              {user.isBanned ? 'Banned' : 'Active'}
            </span>
            <form action={toggleBan.bind(null, user.id, !user.isBanned)}>
              <button type="submit" className={`btn btn-sm ${user.isBanned ? 'btn-success' : 'btn-danger'}`}>
                {user.isBanned ? 'Unban User' : 'Ban User'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="section-title">Recent Orders</p>
      {orders.length === 0 ? (
        <div className="card-padded empty-state">No orders yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{o.orderNumber}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>${o.total}</td>
                  <td><span className="badge badge-neutral">{o.status.replace(/_/g,' ')}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{o.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
