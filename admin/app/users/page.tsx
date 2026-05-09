import { getDb, schema } from '@tayo/database';
import { ilike } from 'drizzle-orm';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = getDb();
  const users = await db.query.users.findMany({
    where: q ? ilike(schema.users.email, `%${q}%`) : undefined,
    orderBy: (u, { desc }) => [desc(u.createdAt)],
    limit: 50,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} users{q ? ` matching "${q}"` : ''}</p>
        </div>
      </div>

      <form className="filter-bar" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
          <input name="q" defaultValue={q} placeholder="Search by email…" style={{ paddingLeft: '2.25rem' }} />
        </div>
        <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        {q && <Link href="/users" className="btn btn-ghost btn-sm">Clear</Link>}
      </form>

      <div className="table-wrap" style={{ borderRadius: '0 0 var(--radius) var(--radius)', borderTop: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{u.email}</td>
                <td>{u.name}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' || u.role === 'super_admin' ? 'badge-orange' : 'badge-neutral'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem' }}>{u.createdAt.toLocaleDateString()}</td>
                <td>
                  {u.isBanned
                    ? <span className="badge badge-danger">Banned</span>
                    : <span className="badge badge-success">Active</span>}
                </td>
                <td>
                  <Link href={`/users/${u.id}`} className="btn btn-secondary btn-sm">View</Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
