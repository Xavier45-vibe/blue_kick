import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import type { ProductFormData } from "@/components/admin/product-form-types";
import { allCategories, getProductForEdit } from "@/repositories/admin";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const [p, categories] = await Promise.all([getProductForEdit(id), allCategories()]);
  if (!p) notFound();

  const primary = Math.max(0, p.images.findIndex((i) => i.isPrimary));
  const initial: ProductFormData = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    price: (p.price / 100).toFixed(2),
    compareAtPrice: p.compareAtPrice ? (p.compareAtPrice / 100).toFixed(2) : "",
    sku: p.sku,
    quantity: String(p.quantity),
    lowStockThreshold: String(p.lowStockThreshold),
    weight: p.weight ? String(p.weight) : "",
    categoryId: p.categoryId,
    tags: p.tags.join(", "),
    status: p.status,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
    images: p.images.map((i) => ({ url: i.url, alt: i.altText })),
    primaryIndex: primary,
    variants: p.variants.map((v) => ({ name: v.name, sku: v.sku, price: (v.price / 100).toFixed(2), qty: String(v.inventoryQuantity) })),
  };
  return <ProductForm key={p.id + p.updatedAt.getTime()} initial={initial} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />;
}
