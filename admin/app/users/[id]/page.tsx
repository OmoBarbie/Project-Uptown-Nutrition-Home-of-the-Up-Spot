import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { updateUserRole, toggleBan } from '../actions';

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
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-500 mb-6">{user.email}</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Role</p>
          <form action={updateUserRole.bind(null, user.id)} className="flex gap-2 items-center">
            <select name="role" defaultValue={user.role ?? 'customer'} className="border rounded-md px-2 py-1 text-sm">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button type="submit" className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Update
            </button>
          </form>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Account Status</p>
          <form action={toggleBan.bind(null, user.id, !user.isBanned)}>
            <button
              type="submit"
              className={`text-sm px-3 py-1 rounded-md ${user.isBanned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {user.isBanned ? 'Unban User' : 'Ban User'}
            </button>
          </form>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2">Order #</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2">{o.orderNumber}</td>
                <td className="py-2">${o.total}</td>
                <td className="py-2">{o.status}</td>
                <td className="py-2 text-gray-500">{o.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
