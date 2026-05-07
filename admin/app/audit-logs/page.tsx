import { getDb, schema } from '@tayo/database';
import { eq, and, gte, lte } from 'drizzle-orm';

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; from?: string; to?: string }>;
}) {
  const { entity, from, to } = await searchParams;
  const db = getDb();

  const logs = await db.query.auditLogs.findMany({
    where: and(
      entity ? eq(schema.auditLogs.entityType, entity) : undefined,
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
          {['product', 'order', 'user', 'category'].map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <input type="date" name="from" defaultValue={from} className="border rounded-md px-2 py-1.5 text-sm" />
        <input type="date" name="to" defaultValue={to} className="border rounded-md px-2 py-1.5 text-sm" />
        <button type="submit" className="bg-gray-100 px-3 py-1.5 rounded-md text-sm">
          Filter
        </button>
      </form>
      <div className="space-y-2">
        {logs.map((log) => (
          <details key={log.id} className="border rounded-lg">
            <summary className="p-3 cursor-pointer flex items-center gap-3 text-sm">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  log.action === 'create'
                    ? 'bg-green-100 text-green-700'
                    : log.action === 'delete'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {log.action}
              </span>
              <span className="font-medium">{log.entityType}</span>
              <span className="text-gray-500">{log.entityId}</span>
              <span className="text-gray-400 ml-auto">{log.createdAt.toLocaleString()}</span>
            </summary>
            <div className="px-3 pb-3">
              <pre className="bg-gray-50 rounded p-2 text-xs overflow-x-auto">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            </div>
          </details>
        ))}
        {logs.length === 0 && <p className="text-gray-500">No logs found.</p>}
      </div>
    </div>
  );
}
