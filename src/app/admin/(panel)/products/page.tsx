import Link from "next/link";
import { Pagination } from "@/components/admin/pagination";
import { ProductsTable } from "@/components/admin/products-table";
import { allCategories, listProducts } from "@/repositories/admin";

export const metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const q = str(sp.q);
  const status = str(sp.status);
  const categoryId = str(sp.category);
  const page = Number(str(sp.page)) || 1;
  const [{ rows, total, pages, page: current }, categories] = await Promise.all([listProducts({ q, status, categoryId, page }), allCategories()]);

  return (
    <div>
      <form className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_14rem_auto_auto]" role="search">
        <div>
          <label htmlFor="q" className="label">Search</label>
          <input id="q" name="q" defaultValue={q} placeholder="Name or SKU" className="field" />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" defaultValue={status ?? ""} className="field">
            <option value="">All</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" name="category" defaultValue={categoryId ?? ""} className="field">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-dark self-end">Filter</button>
        <Link href="/admin/products/new" className="btn btn-primary self-end">Add Product</Link>
      </form>

      <ProductsTable
        rows={rows.map((r) => ({
          id: r.id,
          name: r.name,
          sku: r.sku,
          price: r.price,
          quantity: r.quantity,
          lowStockThreshold: r.lowStockThreshold,
          status: r.status,
          category: r.category.name,
          image: r.images[0]?.url || null,
          tone: [r.toneFrom, r.toneTo],
        }))}
      />
      <Pagination page={current} pages={pages} total={total} basePath="/admin/products" params={{ q, status, category: categoryId }} />
    </div>
  );
}
