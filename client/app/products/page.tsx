import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ProductsList } from "./ProductsList";
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';

async function getProductsData() {
  const db = getDb();

  // Fetch all active categories
  const categories = await db.query.categories.findMany({
    where: eq(schema.categories.isActive, true),
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  // Fetch all active products with relations
  const products = await db.query.products.findMany({
    where: eq(schema.products.isActive, true),
    with: {
      category: true,
      variants: {
        where: eq(schema.productVariants.isActive, true),
        orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
      },
    },
  });

  // Fetch product ratings
  const productRatings = await db.query.productRatings.findMany();

  // Transform products to match ProductsList component expectations
  const productsWithRatings = products.map(product => {
    const rating = productRatings.find(r => r.productId === product.id);
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      emoji: product.emoji,
      category: product.category.name,
      categorySlug: product.category.slug,
      isFeatured: product.isFeatured,
      variants: product.variants.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        priceModifier: v.priceModifier,
      })),
      rating: rating ? {
        average: rating.averageRating,
        count: rating.totalReviews,
      } : {
        average: 0,
        count: 0,
      },
    };
  });

  return {
    products: productsWithRatings,
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
    })),
  };
}

export default async function ProductsPage() {
  const { products, categories } = await getProductsData();

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-slate-950">
        <Container className="py-16">
          <ProductsList products={products} categories={categories} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
