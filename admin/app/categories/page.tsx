import { getDb, schema } from '@tayo/database';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { deleteCategory } from './actions';

export default async function CategoriesPage() {
  const db = getDb();
  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });

  const productCounts = await Promise.allSettled(
    categories.map(async (c) => {
      const [result] = await db.select({ count: count() }).from(schema.products).where(eq(schema.products.categoryId, c.id));
      return { id: c.id, count: result.count };
    })
  );

  const countMap = Object.fromEntries(
    productCounts
      .filter((r): r is PromiseFulfilledResult<{ id: string; count: number }> => r.status === 'fulfilled')
      .map((r) => [r.value.id, r.value.count])
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/categories/new" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          New Category
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Name</th>
            <th className="pb-2">Slug</th>
            <th className="pb-2">Products</th>
            <th className="pb-2">Order</th>
            <th className="pb-2">Active</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-3 font-medium">{c.name}</td>
              <td className="py-3 text-gray-500">{c.slug}</td>
              <td className="py-3">{countMap[c.id] ?? 0}</td>
              <td className="py-3">{c.sortOrder}</td>
              <td className="py-3">{c.isActive ? '✓' : '—'}</td>
              <td className="py-3 flex gap-3">
                <Link href={`/categories/${c.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <form action={deleteCategory.bind(null, c.id)}>
                  <button type="submit" className="text-red-600 hover:underline">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
