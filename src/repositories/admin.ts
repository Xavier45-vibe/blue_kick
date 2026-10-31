/** Read models for the admin screens (lists, filters, dashboard metrics). */
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { orderInclude, toOrder } from "./mappers";

export const PAGE_SIZE = 10;

export async function dashboardStats() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [revenue, ordersToday, lowStock, subscribers, recent] = await Promise.all([
    db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: start }, paymentStatus: "paid" } }),
    db.order.count({ where: { createdAt: { gte: start } } }),
    db.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*)::bigint AS count FROM "Product" WHERE "trackInventory" = true AND "status" = 'active' AND "quantity" <= "lowStockThreshold"`,
    db.subscriber.count(),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  return {
    revenueToday: revenue._sum.total ?? 0,
    ordersToday,
    lowStock: Number(lowStock[0]?.count ?? 0),
    subscribers,
    recent,
  };
}

export async function listProducts(params: { q?: string; status?: string; categoryId?: string; page?: number }) {
  const where: Prisma.ProductWhereInput = {};
  if (params.q) where.OR = [{ name: { contains: params.q, mode: "insensitive" } }, { sku: { contains: params.q, mode: "insensitive" } }];
  if (params.status && ["draft", "active", "archived"].includes(params.status)) where.status = params.status as "draft" | "active" | "archived";
  if (params.categoryId) where.categoryId = params.categoryId;
  const page = Math.max(1, params.page ?? 1);
  const [rows, total] = await Promise.all([
    db.product.findMany({ where, include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true }, orderBy: { updatedAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.product.count({ where }),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductForEdit(id: string) {
  return db.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } }, variants: true } });
}

export async function allCategories() {
  return db.category.findMany({ orderBy: { position: "asc" }, include: { _count: { select: { products: true } } } });
}

export async function listOrders(params: { q?: string; status?: string; from?: string; to?: string; page?: number }) {
  const where: Prisma.OrderWhereInput = {};
  if (params.q) {
    const q = params.q.trim();
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { shippingAddress: { path: ["firstName"], string_contains: q } },
      { shippingAddress: { path: ["lastName"], string_contains: q } },
    ];
  }
  if (params.status && ["unfulfilled", "shipped", "delivered", "cancelled"].includes(params.status)) {
    where.fulfillmentStatus = params.status as "unfulfilled" | "shipped" | "delivered" | "cancelled";
  }
  const range: Prisma.DateTimeFilter = {};
  if (params.from) range.gte = new Date(params.from);
  if (params.to) range.lte = new Date(`${params.to}T23:59:59.999Z`);
  if (range.gte || range.lte) where.createdAt = range;
  const page = Math.max(1, params.page ?? 1);
  const [rows, total] = await Promise.all([
    db.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.order.count({ where }),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getOrderDetail(id: string) {
  const r = await db.order.findUnique({ where: { id }, include: orderInclude });
  return r ? { order: toOrder(r), notes: r.internalNotes } : null;
}

export async function listCustomers() {
  const groups = await db.order.groupBy({
    by: ["email"],
    _count: { _all: true },
    _sum: { total: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
  });
  return groups.map((g) => ({ email: g.email, orders: g._count._all, spent: g._sum.total ?? 0, last: g._max.createdAt }));
}

export async function listSubscribers(q?: string) {
  return db.subscriber.findMany({ where: q ? { email: { contains: q, mode: "insensitive" } } : {}, orderBy: { createdAt: "desc" }, take: 500 });
}

export async function listTeam() {
  return db.teamMember.findMany({ orderBy: { position: "asc" } });
}
