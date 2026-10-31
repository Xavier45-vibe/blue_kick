/** Maps Prisma rows to the domain types the UI and services use. */
import type { Prisma } from "@/generated/prisma/client";
import type { Order } from "@/domain/order";
import type { Address } from "@/domain/order";
import type { Product, TeamMember } from "@/domain/product";

export const productInclude = { images: { orderBy: { position: "asc" } }, variants: true } satisfies Prisma.ProductInclude;
export type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortDescription: r.shortDescription,
    description: r.description,
    price: r.price,
    compareAtPrice: r.compareAtPrice ?? undefined,
    costPrice: r.costPrice ?? undefined,
    sku: r.sku,
    barcode: r.barcode ?? undefined,
    status: r.status,
    isFeatured: r.isFeatured,
    isNew: r.isNew,
    categoryId: r.categoryId,
    tags: r.tags,
    images: r.images.map((i) => ({ id: i.id, productId: i.productId, url: i.url, altText: i.altText, position: i.position, isPrimary: i.isPrimary })),
    variants: r.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      name: v.name,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice ?? undefined,
      inventoryQuantity: v.inventoryQuantity,
      attributes: (v.attributes as Record<string, string>) ?? {},
    })),
    inventory: { quantity: r.quantity, lowStockThreshold: r.lowStockThreshold, trackInventory: r.trackInventory, allowBackorder: r.allowBackorder },
    seoTitle: r.seoTitle ?? undefined,
    seoDescription: r.seoDescription ?? undefined,
    weight: r.weight ?? undefined,
    dimensions: (r.dimensions as Product["dimensions"]) ?? undefined,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    tone: [r.toneFrom, r.toneTo],
  };
}

export function toTeam(r: { id: string; name: string; role: string; bio: string; position: number; toneFrom: string; toneTo: string; photoUrl: string | null }): TeamMember & { photoUrl?: string } {
  return { id: r.id, name: r.name, role: r.role, bio: r.bio, position: r.position, tone: [r.toneFrom, r.toneTo], photoUrl: r.photoUrl ?? undefined };
}

export const orderInclude = { items: true, internalNotes: { orderBy: { createdAt: "desc" } } } satisfies Prisma.OrderInclude;
export type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    number: r.number,
    idempotencyKey: r.idempotencyKey,
    email: r.email,
    shippingAddress: r.shippingAddress as unknown as Address,
    billingAddress: r.billingAddress as unknown as Address,
    items: r.items.map((i) => ({ productId: i.productId, name: i.name, sku: i.sku, unitPrice: i.unitPrice, quantity: i.quantity, tone: [i.toneFrom, i.toneTo] })),
    subtotal: r.subtotal,
    discount: r.discount,
    shipping: r.shipping,
    total: r.total,
    shippingMethodId: r.shippingMethodId,
    shippingMethodName: r.shippingMethodName,
    estimatedDelivery: r.estimatedDelivery.toISOString(),
    paymentMethod: r.paymentMethod,
    paymentReference: r.paymentReference,
    paymentStatus: r.paymentStatus,
    fulfillmentStatus: r.fulfillmentStatus,
    trackingNumber: r.trackingNumber ?? undefined,
    note: r.note ?? undefined,
    createdAt: r.createdAt.toISOString(),
  };
}
