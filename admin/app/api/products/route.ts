// Example Admin API Route - Server-side only
// Database access is safe here because this code runs on the server

import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@tayo/database';
import { eq, desc } from 'drizzle-orm';

// GET all products (admin view - includes inactive)
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const products = await db.query.products.findMany({
      orderBy: [desc(schema.products.createdAt)],
      with: {
        category: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const data = await request.json();

    const [product] = await db.insert(schema.products).values({
      categoryId: data.categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      stockQuantity: data.stockQuantity || 0,
      // ... other fields
    }).returning();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const data = await request.json();
    const { id, ...updateData } = data;

    const [product] = await db.update(schema.products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(schema.products.id, id))
      .returning();

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await db.delete(schema.products)
      .where(eq(schema.products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
