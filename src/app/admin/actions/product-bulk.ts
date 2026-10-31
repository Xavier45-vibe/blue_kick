"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/session";

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteProducts(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  if (!ids.length) return fail("Nothing selected.");
  try {
    // Products that were ordered are archived (order history must stay intact); the rest are removed.
    const ordered = await db.orderItem.findMany({ where: { productId: { in: ids } }, select: { productId: true }, distinct: ["productId"] });
    const keep = new Set(ordered.map((o) => o.productId));
    const removable = ids.filter((i) => !keep.has(i));
    if (removable.length) await db.product.deleteMany({ where: { id: { in: removable } } });
    if (keep.size) await db.product.updateMany({ where: { id: { in: [...keep] } }, data: { status: "archived" } });
    refresh();
    return done(keep.size ? `Deleted ${removable.length}; archived ${keep.size} with order history.` : `Deleted ${removable.length} product(s).`);
  } catch (e) {
    console.error("[deleteProducts]", e);
    return fail("Could not delete.");
  }
}

export async function setProductsStatus(ids: string[], status: "draft" | "active" | "archived"): Promise<ActionState> {
  await requireAdmin();
  if (!ids.length) return fail("Nothing selected.");
  await db.product.updateMany({ where: { id: { in: ids } }, data: { status } });
  refresh();
  return done(`Updated ${ids.length} product(s).`);
}

export async function duplicateProduct(id: string): Promise<ActionState> {
  await requireAdmin();
  const p = await db.product.findUnique({ where: { id }, include: { images: true } });
  if (!p) return fail("Product not found.");
  const suffix = Date.now().toString(36).slice(-4);
  await db.product.create({
    data: {
      slug: `${p.slug}-copy-${suffix}`,
      name: `${p.name} (copy)`,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      sku: `${p.sku}-C${suffix}`,
      status: "draft",
      categoryId: p.categoryId,
      tags: p.tags,
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
      weight: p.weight,
      toneFrom: p.toneFrom,
      toneTo: p.toneTo,
      images: { create: p.images.map((i) => ({ url: i.url, altText: i.altText, position: i.position, isPrimary: i.isPrimary })) },
    },
  });
  refresh();
  return done("Product duplicated as a draft.");
}
