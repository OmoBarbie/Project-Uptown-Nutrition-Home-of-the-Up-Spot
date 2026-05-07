import { getDb, schema } from '@tayo/database';
import { eq, gte, and, sql, count, sum, desc } from 'drizzle-orm';
import { all } from 'better-all';

export async function getDashboardData() {
  const db = getDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const {
    ordersToday,
    revenueToday,
    lowStockProducts,
    recentOrders,
    dailyRevenue,
    orderStatusBreakdown,
    topProducts,
    newCustomers,
  } = await all({
    async ordersToday() {
      return db.select({ count: count() }).from(schema.orders)
        .where(and(gte(schema.orders.createdAt, todayStart), sql`${schema.orders.status} != 'cancelled'`))
        .then(([r]) => r.count);
    },
    async revenueToday() {
      return db.select({ total: sum(schema.orders.total) }).from(schema.orders)
        .where(and(gte(schema.orders.createdAt, todayStart), sql`${schema.orders.paymentStatus} = 'succeeded'`))
        .then(([r]) => parseFloat(r.total ?? '0'));
    },
    async lowStockProducts() {
      return db.select({ count: count() }).from(schema.products)
        .where(and(eq(schema.products.isActive, true), sql`${schema.products.stockQuantity} < 10`))
        .then(([r]) => r.count);
    },
    async recentOrders() {
      return db.select({
        id: schema.orders.id,
        orderNumber: schema.orders.orderNumber,
        customerName: schema.orders.customerName,
        total: schema.orders.total,
        status: schema.orders.status,
        createdAt: schema.orders.createdAt,
      }).from(schema.orders)
        .orderBy(desc(schema.orders.createdAt))
        .limit(5);
    },
    async dailyRevenue() {
      return db.select({
        date: sql<string>`DATE(${schema.orders.createdAt})`.as('date'),
        revenue: sum(schema.orders.total).as('revenue'),
      })
        .from(schema.orders)
        .where(and(gte(schema.orders.createdAt, thirtyDaysAgo), sql`${schema.orders.paymentStatus} = 'succeeded'`))
        .groupBy(sql`DATE(${schema.orders.createdAt})`)
        .orderBy(sql`DATE(${schema.orders.createdAt})`);
    },
    async orderStatusBreakdown() {
      return db.select({ status: schema.orders.status, count: count() })
        .from(schema.orders)
        .where(gte(schema.orders.createdAt, thirtyDaysAgo))
        .groupBy(schema.orders.status);
    },
    async topProducts() {
      return db.select({
        productId: schema.orderItems.productId,
        productName: schema.orderItems.productName,
        units: sum(schema.orderItems.quantity).as('units'),
      })
        .from(schema.orderItems)
        .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
        .where(gte(schema.orders.createdAt, thirtyDaysAgo))
        .groupBy(schema.orderItems.productId, schema.orderItems.productName)
        .orderBy(desc(sql`units`))
        .limit(5);
    },
    async newCustomers() {
      return db.select({ count: count() }).from(schema.users)
        .where(and(eq(schema.users.role, 'customer'), gte(schema.users.createdAt, thirtyDaysAgo)))
        .then(([r]) => r.count);
    },
  });

  return {
    today: { ordersToday, revenueToday, lowStockProducts, recentOrders },
    thirtyDay: { dailyRevenue, orderStatusBreakdown, topProducts, newCustomers },
  };
}
