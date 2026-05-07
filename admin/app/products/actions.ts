'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

export type ProductFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    emoji?: string;
    stock?: string;
  };
};

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const emoji = formData.get('emoji') as string;
  const stock = formData.get('stock') as string;

  // Validation
  const errors: ProductFormState['errors'] = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!description || description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    errors.price = 'Price must be a valid positive number';
  }

  if (!category || category.trim().length < 2) {
    errors.category = 'Category is required';
  }

  if (!emoji || emoji.trim().length === 0) {
    errors.emoji = 'Emoji is required';
  }

  if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
    errors.stock = 'Stock must be a valid non-negative number';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Get authenticated user
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
      return { message: 'Unauthorized. Please log in.' };
    }

    const db = getDb();

    // Generate slug from name
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const productData = {
      name: name.trim(),
      slug,
      description: description.trim(),
      price: parseFloat(price).toFixed(2),
      categoryId: category.trim(),
      emoji: emoji.trim(),
      stockQuantity: parseInt(stock),
      imageUrl: '', // TODO: Add image upload functionality
    };

    const [newProduct] = await db.insert(schema.products).values(productData).returning();

    // Handle variants
    const variantsRaw = formData.get('variants') as string | null;
    let variants: Array<{ id?: string; name: string; type: string; priceModifier: string; stockQuantity: number; isActive: boolean; sortOrder: number }> = [];
    if (variantsRaw) {
      try {
        const parsed = JSON.parse(variantsRaw);
        if (Array.isArray(parsed)) {
          variants = parsed.filter((v) => v && typeof v.name === 'string' && typeof v.type === 'string');
        }
      } catch {
        // malformed JSON — proceed with no variants
      }
    }

    for (const v of variants) {
      await db.insert(schema.productVariants).values({
        productId: newProduct.id,
        name: v.name, type: v.type, priceModifier: v.priceModifier,
        stockQuantity: v.stockQuantity, isActive: v.isActive, sortOrder: v.sortOrder,
      });
    }

    // Audit log
    await createAuditLog(session.user.id, {
      action: 'create',
      entityType: 'product',
      entityId: newProduct.id,
      changes: { after: productData },
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    return {
      message: 'Failed to create product. Please try again.',
    };
  }

  revalidatePath('/products');
  redirect('/products');
}

export async function updateProduct(
  productId: string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const category = formData.get('category') as string;
  const emoji = formData.get('emoji') as string;
  const stock = formData.get('stock') as string;

  // Validation
  const errors: ProductFormState['errors'] = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!description || description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    errors.price = 'Price must be a valid positive number';
  }

  if (!category || category.trim().length < 2) {
    errors.category = 'Category is required';
  }

  if (!emoji || emoji.trim().length === 0) {
    errors.emoji = 'Emoji is required';
  }

  if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
    errors.stock = 'Stock must be a valid non-negative number';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Get authenticated user
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
      return { message: 'Unauthorized. Please log in.' };
    }

    const db = getDb();

    // Get current product for audit trail
    const [oldProduct] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, productId))
      .limit(1);

    // Generate slug from name
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const updatedData = {
      name: name.trim(),
      slug,
      description: description.trim(),
      price: parseFloat(price).toFixed(2),
      categoryId: category.trim(),
      emoji: emoji.trim(),
      stockQuantity: parseInt(stock),
      updatedAt: new Date(),
    };

    await db
      .update(schema.products)
      .set(updatedData)
      .where(eq(schema.products.id, productId));

    // Handle variants
    const variantsRaw = formData.get('variants') as string | null;
    let variants: Array<{ id?: string; name: string; type: string; priceModifier: string; stockQuantity: number; isActive: boolean; sortOrder: number }> = [];
    if (variantsRaw) {
      try {
        const parsed = JSON.parse(variantsRaw);
        if (Array.isArray(parsed)) {
          variants = parsed.filter((v) => v && typeof v.name === 'string' && typeof v.type === 'string');
        }
      } catch {
        // malformed JSON — proceed with no variants
      }
    }

    // Always sync variants: delete orphans even when list is empty
    const incomingIds = variants.filter((v) => v.id).map((v) => v.id as string);
    const existing = await db.query.productVariants.findMany({ where: eq(schema.productVariants.productId, productId) });
    for (const ev of existing) {
      if (!incomingIds.includes(ev.id)) {
        await db.delete(schema.productVariants).where(eq(schema.productVariants.id, ev.id));
      }
    }
    for (const v of variants) {
      if (v.id) {
        await db.update(schema.productVariants)
          .set({ name: v.name, type: v.type, priceModifier: v.priceModifier, stockQuantity: v.stockQuantity, isActive: v.isActive, sortOrder: v.sortOrder, updatedAt: new Date() })
          .where(eq(schema.productVariants.id, v.id));
      } else {
        await db.insert(schema.productVariants).values({
          productId,
          name: v.name, type: v.type, priceModifier: v.priceModifier,
          stockQuantity: v.stockQuantity, isActive: v.isActive, sortOrder: v.sortOrder,
        });
      }
    }

    // Audit log
    await createAuditLog(session.user.id, {
      action: 'update',
      entityType: 'product',
      entityId: productId,
      changes: {
        before: oldProduct,
        after: updatedData,
      },
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return {
      message: 'Failed to update product. Please try again.',
    };
  }

  revalidatePath('/products');
  revalidatePath(`/products/${productId}/edit`);
  redirect('/products');
}

export async function deleteProduct(productId: string) {
  try {
    // Get authenticated user
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
      throw new Error('Unauthorized. Please log in.');
    }

    const db = getDb();

    // Get product for audit trail before deletion
    const [productToDelete] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, productId))
      .limit(1);

    await db.delete(schema.products).where(eq(schema.products.id, productId));

    // Audit log
    await createAuditLog(session.user.id, {
      action: 'delete',
      entityType: 'product',
      entityId: productId,
      changes: { before: productToDelete },
    });

    revalidatePath('/products');
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
}
