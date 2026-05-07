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
  return await db.select().from(schema.categories).where(schema.categories.isActive).orderBy(asc(schema.categories.sortOrder));
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const updateProductWithId = updateProduct.bind(null, params.id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update product information
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
        <ProductForm
          action={updateProductWithId}
          categories={categories}
          initialData={{
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            emoji: product.emoji || '',
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
