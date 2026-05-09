import { getDb, schema } from '@tayo/database';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

type AuditAction = 'create' | 'update' | 'delete';
type EntityType = 'product' | 'order' | 'user' | 'category' | 'review';

interface AuditLogData {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  changes?: {
    before?: unknown;
    after?: unknown;
  };
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(
  userId: string,
  data: AuditLogData
): Promise<void> {
  try {
    const db = getDb();
    const headersList = await headers();

    // Get request metadata
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await db.insert(schema.auditLogs).values({
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      changes: data.changes || null,
      metadata: {
        ip,
        userAgent,
        ...data.metadata,
      },
    });
  } catch (error) {
    // Log error but don't fail the operation
    console.error('Failed to create audit log:', error);
  }
}

// Helper to get audit logs for an entity
export async function getEntityAuditLogs(
  entityType: EntityType,
  entityId: string
) {
  try {
    const db = getDb();

    const logs = await db
      .select()
      .from(schema.auditLogs)
      .where(and(
        eq(schema.auditLogs.entityType, entityType),
        eq(schema.auditLogs.entityId, entityId),
      ))
      .orderBy(schema.auditLogs.createdAt);

    return logs;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}
