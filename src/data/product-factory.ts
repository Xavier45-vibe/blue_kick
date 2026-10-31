import type { Product } from "@/domain/product";

export interface ProductSeed {
  slug: string;
  name: string;
  short: string;
  long: string;
  price: number;
  compareAt?: number;
  category: string;
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  stock: number;
  tone: [string, string];
  weight: number;
  variants?: { name: string; price: number; qty: number; attributes: Record<string, string> }[];
}

const NOW = "2026-10-01T09:00:00.000Z";

/** Turns compact seed rows into full Product entities. */
export function buildProduct(seed: ProductSeed, index: number): Product {
  const n = String(index + 1).padStart(3, "0");
  const id = `prod-${n}`;
  return {
    id,
    slug: seed.slug,
    name: seed.name,
    shortDescription: seed.short,
    description: seed.long,
    price: seed.price,
    compareAtPrice: seed.compareAt,
    sku: `BK-0${n}`,
    status: "active",
    isFeatured: Boolean(seed.featured),
    isNew: Boolean(seed.isNew),
    categoryId: seed.category,
    tags: seed.tags,
    images: [{ id: `${id}-img-1`, productId: id, url: "", altText: `${seed.name} artwork`, position: 1, isPrimary: true }],
    variants: (seed.variants ?? []).map((v, i) => ({
      id: `${id}-var-${i + 1}`,
      productId: id,
      name: v.name,
      sku: `BK-0${n}-${i + 1}`,
      price: v.price,
      inventoryQuantity: v.qty,
      attributes: v.attributes,
    })),
    inventory: { quantity: seed.stock, lowStockThreshold: 10, trackInventory: true, allowBackorder: false },
    weight: seed.weight,
    createdAt: NOW,
    updatedAt: NOW,
    tone: seed.tone,
  };
}
