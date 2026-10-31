"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { slugify, toCents, toInt } from "@/lib/slug";
import { requireAdmin } from "@/lib/session";

type VariantInput = { name: string; sku: string; price: string; qty: string };

function parseVariants(raw: string, fallbackPrice: number) {
  const list = JSON.parse(raw || "[]") as VariantInput[];
  return list
    .filter((v) => v.name?.trim() && v.sku?.trim())
    .map((v) => ({
      name: v.name.trim(),
      sku: v.sku.trim(),
      price: Math.round(Number(v.price) * 100) || fallbackPrice,
      inventoryQuantity: toInt(v.qty),
    }));
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "draft");
  const name = String(formData.get("name") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const price = toCents(formData.get("price"));
  const compareAtPrice = toCents(formData.get("compareAtPrice"));
  const slug = slugify(String(formData.get("slug") ?? "") || name);

  if (name.length < 2) return fail("Name is required.");
  if (!slug) return fail("Slug could not be generated.");
  if (!shortDescription) return fail("Short description is required.");
  if (shortDescription.length > 160) return fail("Short description must be 160 characters or fewer.");
  if (!description) return fail("Description is required.");
  if (!sku) return fail("SKU is required.");
  if (!categoryId) return fail("Choose a category.");
  if (price === null) return fail("Enter a valid price.");
  if (compareAtPrice !== null && compareAtPrice <= price) return fail("Compare-at price must be higher than the price.");

  const urls = formData.getAll("imageUrl").map(String).filter(Boolean);
  const alts = formData.getAll("imageAlt").map(String);
  const primaryIndex = toInt(formData.get("primaryImage"), 0);
  if (urls.length === 0 && intent === "publish") return fail("Add at least one image before publishing.");

  let variants: ReturnType<typeof parseVariants> = [];
  try {
    variants = parseVariants(String(formData.get("variants") ?? "[]"), price);
  } catch {
    return fail("Variants data was invalid.");
  }

  const status = intent === "publish" ? ("active" as const) : formData.get("status") === "archived" ? ("archived" as const) : ("draft" as const);
  const data = {
    slug,
    name,
    shortDescription,
    description,
    price,
    compareAtPrice,
    sku,
    status,
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    categoryId,
    tags: String(formData.get("tags") ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    quantity: toInt(formData.get("quantity")),
    lowStockThreshold: toInt(formData.get("lowStockThreshold"), 10),
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
    weight: formData.get("weight") ? toInt(formData.get("weight")) : null,
  };

  let savedId = id;
  try {
    const images = urls.map((url, i) => ({ url, altText: alts[i]?.trim() || name, position: i, isPrimary: i === primaryIndex }));
    const saved = await db.$transaction(async (tx) => {
      if (id) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productVariant.deleteMany({ where: { productId: id } });
        return tx.product.update({ where: { id }, data: { ...data, images: { create: images }, variants: { create: variants } } });
      }
      return tx.product.create({ data: { ...data, images: { create: images }, variants: { create: variants } } });
    });
    savedId = saved.id;
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return fail("That slug or SKU is already in use.");
    console.error("[saveProduct]", e);
    return fail("Could not save the product.");
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  if (!id) redirect(`/admin/products/${savedId}?saved=1`);
  return done(intent === "publish" ? "Product published." : "Product saved.");
}
