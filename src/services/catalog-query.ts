/**
 * Catalogue filtering and sorting.
 * SOLID: Open/Closed - add a new sort or filter by registering a strategy;
 * `queryProducts` never changes. Pure functions, safe on server and client.
 */
import type { Product } from "@/domain/product";

export interface CatalogQuery {
  categoryId?: string;
  search?: string;
  tag?: string;
  inStockOnly?: boolean;
  sort?: string;
}

export type ProductFilter = (product: Product, query: CatalogQuery) => boolean;
export type ProductComparator = (a: Product, b: Product) => number;

export const filterStrategies: ProductFilter[] = [
  (p, q) => !q.categoryId || p.categoryId === q.categoryId,
  (p, q) => !q.tag || p.tags.includes(q.tag),
  (p, q) => !q.inStockOnly || p.inventory.quantity > 0 || p.inventory.allowBackorder,
  (p, q) => {
    const term = q.search?.trim().toLowerCase();
    if (!term) return true;
    return [p.name, p.shortDescription, ...p.tags].some((s) => s.toLowerCase().includes(term));
  },
];

export const sortStrategies: Record<string, { label: string; compare: ProductComparator }> = {
  featured: { label: "Featured", compare: (a, b) => Number(b.isFeatured) - Number(a.isFeatured) },
  newest: { label: "Newest", compare: (a, b) => Number(b.isNew) - Number(a.isNew) },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
  name: { label: "Name A–Z", compare: (a, b) => a.name.localeCompare(b.name) },
};

export function queryProducts(all: Product[], query: CatalogQuery): Product[] {
  const compare = (sortStrategies[query.sort ?? "featured"] ?? sortStrategies.featured).compare;
  return all.filter((p) => filterStrategies.every((f) => f(p, query))).sort(compare);
}

export function collectTags(all: Product[]): string[] {
  return [...new Set(all.flatMap((p) => p.tags))].sort();
}
