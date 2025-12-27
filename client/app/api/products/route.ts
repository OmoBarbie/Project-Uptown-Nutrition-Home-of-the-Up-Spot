// Products API Route - Server-side only
// Database access is safe here because this code runs on the server

import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Fetch all categories
    const categories = await db.query.categories.findMany({
      where: eq(schema.categories.isActive, true),
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    });

    // Build products query with relations
    let productsQuery = db.query.products.findMany({
      where: eq(schema.products.isActive, true),
      with: {
        category: true,
        variants: {
          where: eq(schema.productVariants.isActive, true),
          orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
        },
      },
    });

    const products = await productsQuery;

    // Fetch ratings for all products
    const productRatings = await db.query.productRatings.findMany();

    // Combine products with their ratings
    const productsWithRatings = products.map(product => {
      const rating = productRatings.find(r => r.productId === product.id);
      return {
        ...product,
        rating: rating ? {
          average: rating.averageRating,
          count: rating.totalReviews,
        } : null,
      };
    });

    // Filter by category if specified
    let filteredProducts = productsWithRatings;
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        filteredProducts = productsWithRatings.filter(p => p.categoryId === category.id);
      }
    }

    // Filter by featured if specified
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.isFeatured);
    }

    return NextResponse.json({
      products: filteredProducts,
      categories,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
