'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';
import { sendOrderStatusUpdate } from '@tayo/email';

export type OrderStatusFormState = {
  success?: boolean;
  message?: string;
};

export async function updateOrderStatus(
  orderId: string,
  prevState: OrderStatusFormState,
  formData: FormData
): Promise<OrderStatusFormState> {
  const status = formData.get('status') as string;

  if (!status) {
    return {
      success: false,
      message: 'Status is required',
    };
  }

  const validStatuses = [
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'delivered',
    'completed',
    'cancelled',
    'refunded',
  ];

  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message: 'Invalid status',
    };
  }

  try {
    // Get authenticated user
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
      return {
        success: false,
        message: 'Unauthorized. Please log in.',
      };
    }

    const db = getDb();

    // Get current order for audit trail
    const [oldOrder] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Add timestamps for specific status changes
    if (status === 'confirmed' && !prevState.success) {
      updateData.confirmedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    await db
      .update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, orderId));

    if (['out_for_delivery', 'delivered'].includes(status)) {
      const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
      if (order?.customerEmail) {
        await sendOrderStatusUpdate(order.customerEmail, order.orderNumber, status);
      }
    }

    // Audit log
    await createAuditLog(session.user.id, {
      action: 'update',
      entityType: 'order',
      entityId: orderId,
      changes: {
        before: { status: oldOrder.status },
        after: { status },
      },
      metadata: { orderNumber: oldOrder.orderNumber },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');

    return {
      success: true,
      message: 'Order status updated successfully',
    };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      message: 'Failed to update order status. Please try again.',
    };
  }
}
