import { ProductForm } from "@/components/admin/product-form";
import { emptyProduct } from "@/components/admin/product-form-types";
import { allCategories } from "@/repositories/admin";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await allCategories();
  return <ProductForm initial={emptyProduct} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />;
}
