import { CategoriesManager } from "@/components/admin/categories-manager";
import { allCategories } from "@/repositories/admin";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const rows = await allCategories();
  return (
    <CategoriesManager
      rows={rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "", position: c.position, isActive: c.isActive, products: c._count.products }))}
    />
  );
}
