import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { toggleCoupon } from './actions';

export default async function CouponsPage() {
  const db = getDb();
  const coupons = await db.query.coupons.findMany({ orderBy: (c, { desc }) => [desc(c.createdAt)] });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Link href="/coupons/new" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          New Coupon
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Code</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Value</th>
            <th className="pb-2">Status</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-3 font-mono font-medium">{c.code}</td>
              <td className="py-3 capitalize">{c.type}</td>
              <td className="py-3">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
              <td className="py-3">
                {c.isActive
                  ? <span className="text-green-600">Active</span>
                  : <span className="text-gray-400">Inactive</span>}
              </td>
              <td className="py-3">
                <form action={toggleCoupon.bind(null, c.id, !c.isActive)}>
                  <button type="submit" className="text-sm text-blue-600 hover:underline">
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {coupons.length === 0 && (
            <tr><td colSpan={5} className="py-8 text-center text-gray-400">No coupons yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
