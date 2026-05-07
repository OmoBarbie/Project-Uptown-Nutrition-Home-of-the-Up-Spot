import { getDb, schema } from '@tayo/database';
import { ilike } from 'drizzle-orm';
import Link from 'next/link';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = getDb();

  const users = await db.query.users.findMany({
    where: q ? ilike(schema.users.email, `%${q}%`) : undefined,
    orderBy: (u, { desc }) => [desc(u.createdAt)],
    limit: 50,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by email…" className="border rounded-md px-3 py-2 text-sm w-72" />
        <button type="submit" className="ml-2 bg-gray-100 px-3 py-2 rounded-md text-sm">Search</button>
      </form>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Email</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Joined</th>
            <th className="pb-2">Status</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-3">{u.email}</td>
              <td className="py-3">{u.name}</td>
              <td className="py-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{u.role}</span>
              </td>
              <td className="py-3 text-gray-500">{u.createdAt.toLocaleDateString()}</td>
              <td className="py-3">
                {u.isBanned
                  ? <span className="text-red-600 text-xs">Banned</span>
                  : <span className="text-green-600 text-xs">Active</span>}
              </td>
              <td className="py-3">
                <Link href={`/users/${u.id}`} className="text-blue-600 hover:underline">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
