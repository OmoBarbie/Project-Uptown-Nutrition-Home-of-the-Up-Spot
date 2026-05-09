import { getDb, schema } from '@tayo/database';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductForm } from '../../product-form';
import { updateProduct } from '../../actions';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

async function getProduct(id: string) {
  const db = getDb();

  const [product] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id))
    .limit(1);

  if (!product) return null;

  const variants = await db.query.productVariants.findMany({
    where: eq(schema.productVariants.productId, id),
    orderBy: (v, { asc }) => [asc(v.sortOrder)],
  });

  return { ...product, variants };
}

async function getCategories() {
  const db = getDb();
  return await db.select().from(schema.categories).where(eq(schema.categories.isActive, true)).orderBy(asc(schema.categories.sortOrder));
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/products" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14 }} />
          Back to Products
        </Link>
        <h1 className="page-title">Edit Product</h1>
        <p className="page-subtitle">Update product information</p>
      </div>

      <div className="card-padded">
        <ProductForm
          action={updateProductWithId}
          categories={categories}
          initialData={{
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            emoji: product.emoji || '',
            imageUrl: product.imageUrl || '',
            stock: product.stockQuantity,
            variants: product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              type: v.type,
              priceModifier: v.priceModifier,
              stockQuantity: v.stockQuantity,
              isActive: v.isActive,
              sortOrder: v.sortOrder,
            })),
          }}
          isEdit
        />
      </div>
    </div>
  );
}
