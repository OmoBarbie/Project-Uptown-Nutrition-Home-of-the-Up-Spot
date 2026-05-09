import { getDb, schema } from '@tayo/database';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; from?: string; to?: string }>;
}) {
  const { entity, from, to } = await searchParams;
  const db = getDb();

  const logs = await db
    .select({
      id: schema.auditLogs.id,
      action: schema.auditLogs.action,
      entityType: schema.auditLogs.entityType,
      entityId: schema.auditLogs.entityId,
      changes: schema.auditLogs.changes,
      createdAt: schema.auditLogs.createdAt,
      userName: schema.users.name,
      userEmail: schema.users.email,
    })
    .from(schema.auditLogs)
    .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id))
    .where(
      and(
        entity ? eq(schema.auditLogs.entityType, entity) : undefined,
        from ? gte(schema.auditLogs.createdAt, new Date(from)) : undefined,
        to ? lte(schema.auditLogs.createdAt, new Date(to)) : undefined,
      ),
    )
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(100);

  const actionClass = (a: string) => {
    if (a === 'create') return 'badge badge-success';
    if (a === 'delete') return 'badge badge-danger';
    return 'badge badge-blue';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Last {logs.length} recorded actions</p>
        </div>
      </div>

      <form className="filter-bar" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
        <FunnelIcon style={{ width: 16, height: 16, color: 'var(--text-muted)', flexShrink: 0 }} />
        <select name="entity" defaultValue={entity ?? ''} style={{ width: 'auto', flex: '0 0 auto' }}>
          <option value="">All entities</option>
          {['product','order','user','category'].map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <input type="date" name="from" defaultValue={from} style={{ width: 'auto' }} />
        <input type="date" name="to" defaultValue={to} style={{ width: 'auto' }} />
        <button type="submit" className="btn btn-secondary btn-sm">Filter</button>
      </form>

      <div className="card" style={{ borderRadius: '0 0 var(--radius) var(--radius)', borderTop: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem' }}>
          {logs.map((log) => (
            <details key={log.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <summary style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', listStyle: 'none' }}>
                <span className={actionClass(log.action)}>{log.action}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem' }}>{log.entityType}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.entityId}</span>
                <span className="badge badge-orange" style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
                  {log.userName ?? log.userEmail ?? 'System'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.775rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {log.createdAt.toLocaleString()}
                </span>
              </summary>
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)' }}>
                <pre style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.75rem', overflowX: 'auto', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              </div>
            </details>
          ))}
          {logs.length === 0 && (
            <div className="empty-state"><p>No audit logs found for these filters.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
