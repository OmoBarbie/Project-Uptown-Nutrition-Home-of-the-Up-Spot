import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { ProductDetailClient } from './product-detail-client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id),
  });
  if (!product) return { title: 'Product not found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.imageUrl ? [product.imageUrl] : [] },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();

  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id),
    with: {
      category: true,
      variants: {
        where: eq(schema.productVariants.isActive, true),
        orderBy: (v, { asc }) => [asc(v.sortOrder)],
      },
    },
  });

  if (!product || !product.isActive) notFound();

  const ratings = await db.query.productRatings.findFirst({
    where: eq(schema.productRatings.productId, id),
  });

  return <ProductDetailClient product={product} ratings={ratings ?? null} />;
}
