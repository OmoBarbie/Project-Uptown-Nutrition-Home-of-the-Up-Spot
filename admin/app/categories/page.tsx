import { getDb, schema } from '@tayo/database';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { deleteCategory } from './actions';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} categories</p>
        </div>
        <Link href="/categories/new" className="btn btn-primary">
          <PlusIcon style={{ width: 16, height: 16 }} />
          New Category
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Order</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.slug}</td>
                <td>
                  <span className="badge badge-neutral">{countMap[c.id] ?? 0} products</span>
                </td>
                <td>{c.sortOrder}</td>
                <td>
                  {c.isActive
                    ? <span className="badge badge-success">Active</span>
                    : <span className="badge badge-neutral">Inactive</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/categories/${c.id}/edit`} className="btn btn-secondary btn-sm">
                      <PencilSquareIcon style={{ width: 14, height: 14 }} />
                      Edit
                    </Link>
                    <form action={deleteCategory.bind(null, c.id)}>
                      <button type="submit" className="btn btn-danger btn-sm">
                        <TrashIcon style={{ width: 14, height: 14 }} />
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No categories yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
