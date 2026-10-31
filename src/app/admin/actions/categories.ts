"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { slugify, toInt } from "@/lib/slug";
import { requireAdmin } from "@/lib/session";

function refresh() {
  revalidatePath("/admin/products/categories");
  revalidatePath("/shop");
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return fail("Category name is required.");
  const data = {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    description: String(formData.get("description") ?? "").trim() || null,
    position: toInt(formData.get("position")),
    isActive: formData.get("isActive") === "on",
  };
  try {
    if (id) await db.category.update({ where: { id }, data });
    else await db.category.create({ data });
    refresh();
    return done("Category saved.");
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return fail("That slug is already used.");
    return fail("Could not save the category.");
  }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  await requireAdmin();
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) return fail(`This category still has ${count} product(s). Move them first.`);
  await db.category.delete({ where: { id } });
  refresh();
  return done("Category deleted.");
}
