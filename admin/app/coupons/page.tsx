import { getDb } from '@tayo/database';
import Link from 'next/link';
import { toggleCoupon } from './actions';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function CouponsPage() {
  const db = getDb();
  const coupons = await db.query.coupons.findMany({ orderBy: (c, { desc }) => [desc(c.createdAt)] });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-subtitle">{coupons.length} coupon codes</p>
        </div>
        <Link href="/coupons/new" className="btn btn-primary">
          <PlusIcon style={{ width: 16, height: 16 }} />
          New Coupon
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>
                  <code style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                    {c.code}
                  </code>
                </td>
                <td><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{c.type}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--text)' }}>
                  {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                </td>
                <td style={{ fontSize: '0.8rem' }}>{c.createdAt.toLocaleDateString()}</td>
                <td>
                  {c.isActive
                    ? <span className="badge badge-success">Active</span>
                    : <span className="badge badge-neutral">Inactive</span>}
                </td>
                <td>
                  <form action={toggleCoupon.bind(null, c.id, !c.isActive)}>
                    <button type="submit" className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-success'}`}>
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No coupons yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
