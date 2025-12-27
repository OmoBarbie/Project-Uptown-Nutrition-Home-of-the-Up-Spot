# @tayo/database

Database schema and connection utilities for the Uptown Nutrition monorepo using Drizzle ORM with PostgreSQL (Neon).

## Setup

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Neon database connection string:
     ```
     DATABASE_URL="postgresql://username:password@host.neon.tech/database_name?sslmode=require"
     ```

3. **Generate migrations**
   ```bash
   bun run db:generate
   ```

4. **Push schema to database**
   ```bash
   bun run db:push
   ```

   Or run migrations:
   ```bash
   bun run db:migrate
   ```

5. **Open Drizzle Studio (optional)**
   ```bash
   bun run db:studio
   ```

6. **Seed the database with initial data**
   ```bash
   bun run db:seed
   ```

   This will populate:
   - 4 product categories (Sweet Tooth, Smoothies, Refreshers, Protein Snacks)
   - 8 products with nutritional information
   - Sample users (1 admin, 2 customers)
   - Sample reviews and ratings
   - Product variants (sizes and flavors)

## Schema Overview

### Users & Authentication
- **users**: User accounts (customers and admins)
- **addresses**: User delivery addresses

### Products
- **categories**: Product categories (Sweet Tooth, Smoothies, etc.)
- **products**: Main product catalog
- **product_variants**: Size/flavor variations
- **product_ratings**: Aggregate rating statistics

### Cart & Orders
- **carts**: Shopping carts (persistent)
- **cart_items**: Items in cart
- **orders**: Order records
- **order_items**: Items in each order

### Reviews
- **reviews**: Product reviews
- **review_helpful**: User votes on review helpfulness

## Usage in Next.js Apps

```typescript
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';

// Get database instance
const db = getDb();

// Query example
const products = await db.select()
  .from(schema.products)
  .where(eq(schema.products.isActive, true));

// Insert example
const newProduct = await db.insert(schema.products).values({
  name: 'New Product',
  categoryId: 'category-id',
  price: '10.99',
  // ... other fields
}).returning();
```

## Scripts

- `bun run db:generate` - Generate migrations from schema changes
- `bun run db:migrate` - Run pending migrations
- `bun run db:push` - Push schema directly to database (dev only)
- `bun run db:studio` - Open Drizzle Studio GUI
- `bun run db:seed` - Seed database with initial data from client app

## Database Provider

This project uses [Neon](https://neon.tech) as the PostgreSQL provider. Neon features:
- Serverless Postgres
- Autoscaling
- Branching for dev/staging/prod
- Built-in connection pooling

## Notes

- CUID2 is used for primary keys instead of UUIDs for better performance
- All timestamps include timezone information
- Foreign keys use appropriate cascade/restrict rules
- Indexes are added to frequently queried columns
