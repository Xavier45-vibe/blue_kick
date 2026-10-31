/**
 * Prisma adapters implementing the same ports the in-memory versions did.
 * Services never import this file directly; only `services/container.ts` does.
 */
import { db } from "@/lib/db";
import type { Category, Product, TeamMember } from "@/domain/product";
import type { Order } from "@/domain/order";
import type { CategoryReader, ContactStore, NewsletterStore, OrderStore, ProductReader, StockWriter, TeamReader } from "@/services/ports";
import { orderInclude, productInclude, toOrder, toProduct, toTeam } from "./mappers";

export class PrismaProductRepository implements ProductReader, StockWriter {
  async list(): Promise<Product[]> {
    const rows = await db.product.findMany({ where: { status: "active" }, include: productInclude, orderBy: { createdAt: "desc" } });
    return rows.map(toProduct);
  }
  async findBySlug(slug: string) {
    const r = await db.product.findFirst({ where: { slug, status: "active" }, include: productInclude });
    return r ? toProduct(r) : null;
  }
  async findById(id: string) {
    const r = await db.product.findUnique({ where: { id }, include: productInclude });
    return r ? toProduct(r) : null;
  }
  /** Atomic conditional decrement: succeeds only if enough stock remains. */
  async reserve(productId: string, quantity: number) {
    const p = await db.product.findUnique({ where: { id: productId }, select: { trackInventory: true, allowBackorder: true } });
    if (!p) return false;
    if (!p.trackInventory || p.allowBackorder) {
      await db.product.update({ where: { id: productId }, data: { quantity: { decrement: quantity } } });
      return true;
    }
    const res = await db.product.updateMany({ where: { id: productId, quantity: { gte: quantity } }, data: { quantity: { decrement: quantity } } });
    return res.count === 1;
  }
  async release(productId: string, quantity: number) {
    await db.product.update({ where: { id: productId }, data: { quantity: { increment: quantity } } });
  }
}

export class PrismaCategoryRepository implements CategoryReader {
  async list(): Promise<Category[]> {
    const rows = await db.category.findMany({ where: { isActive: true }, orderBy: { position: "asc" } });
    return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? undefined, parentId: c.parentId, image: c.image ?? undefined, position: c.position, isActive: c.isActive }));
  }
}

export class PrismaTeamRepository implements TeamReader {
  async list(): Promise<TeamMember[]> {
    const rows = await db.teamMember.findMany({ orderBy: { position: "asc" } });
    return rows.map(toTeam);
  }
}

export class PrismaNewsletterStore implements NewsletterStore {
  async add(email: string, source: string) {
    const key = email.toLowerCase();
    const existing = await db.subscriber.findUnique({ where: { email: key } });
    if (existing) return { created: false };
    await db.subscriber.create({ data: { email: key, source } });
    return { created: true };
  }
}

export class PrismaContactStore implements ContactStore {
  async save(message: { name: string; email: string; message: string }) {
    await db.contactMessage.create({ data: message });
  }
}

export class PrismaOrderStore implements OrderStore {
  async save(order: Order) {
    await db.order.create({
      data: {
        id: order.id,
        number: order.number,
        idempotencyKey: order.idempotencyKey,
        email: order.email,
        shippingAddress: order.shippingAddress as object,
        billingAddress: order.billingAddress as object,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        shippingMethodId: order.shippingMethodId,
        shippingMethodName: order.shippingMethodName,
        estimatedDelivery: new Date(order.estimatedDelivery),
        paymentMethod: order.paymentMethod,
        paymentReference: order.paymentReference,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        note: order.note,
        items: {
          create: order.items.map((i) => ({ productId: i.productId, name: i.name, sku: i.sku, unitPrice: i.unitPrice, quantity: i.quantity, toneFrom: i.tone[0], toneTo: i.tone[1] })),
        },
      },
    });
  }
  async findById(id: string) {
    const r = await db.order.findUnique({ where: { id }, include: orderInclude });
    return r ? toOrder(r) : null;
  }
  async findByIdempotencyKey(key: string) {
    const r = await db.order.findUnique({ where: { idempotencyKey: key }, include: orderInclude });
    return r ? toOrder(r) : null;
  }
}
