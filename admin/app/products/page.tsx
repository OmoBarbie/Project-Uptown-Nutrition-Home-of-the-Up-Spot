import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DeleteProductButton } from './delete-button';

async function getProducts() {
  const db = getDb();
  return db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      description: schema.products.description,
      price: schema.products.price,
      imageUrl: schema.products.imageUrl,
      emoji: schema.products.emoji,
      stockQuantity: schema.products.stockQuantity,
      isActive: schema.products.isActive,
      isFeatured: schema.products.isFeatured,
      categoryName: schema.categories.name,
    })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .orderBy(schema.products.createdAt);
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} products in inventory</p>
        </div>
        <Link href="/products/new" className="btn btn-primary">
          <PlusIcon style={{ width: 16, height: 16 }} />
          Add Product
        </Link>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table style={{ minWidth: 940 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ minWidth: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                        overflow: 'hidden',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem',
                      }}>
                        {product.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : product.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem' }}>{product.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{product.categoryName ?? '—'}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>${parseFloat(product.price).toFixed(2)}</td>
                  <td style={{ color: product.stockQuantity > 0 ? 'var(--text)' : 'var(--danger)', fontWeight: 600 }}>
                    {product.stockQuantity}
                  </td>
                  <td>
                    {product.stockQuantity > 0
                      ? <span className="badge badge-success">In Stock</span>
                      : <span className="badge badge-danger">Out of Stock</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <Link href={`/products/${product.id}/edit`} className="btn btn-secondary btn-sm">
                        <PencilIcon style={{ width: 14, height: 14 }} />
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products yet.
                    <Link href="/products/new" className="btn btn-primary btn-sm" style={{ marginLeft: '0.75rem' }}>Add your first product</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
