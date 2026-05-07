import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { ProductDetailClient } from './product-detail-client';
import { ReviewsSection } from './reviews-section';
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(ratings && ratings.totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratings.averageRating,
        reviewCount: ratings.totalReviews,
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} ratings={ratings ?? null} />
      <div id="reviews">
        <ReviewsSection productId={id} ratings={ratings ?? null} />
      </div>
    </div>
  );
}
