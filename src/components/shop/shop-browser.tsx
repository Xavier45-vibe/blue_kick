"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/domain/product";
import { ProductCard } from "@/components/product/product-card";
import { collectTags, queryProducts, sortStrategies } from "@/services/catalog-query";

export function ShopBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [categoryId, setCategoryId] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const tags = useMemo(() => collectTags(products), [products]);
  const results = useMemo(
    () => queryProducts(products, { categoryId: categoryId || undefined, tag: tag || undefined, search, sort, inStockOnly }),
    [products, categoryId, tag, search, sort, inStockOnly],
  );
  const reset = () => { setCategoryId(""); setTag(""); setSearch(""); setInStockOnly(false); };

  const pill = (active: boolean) =>
    `rounded-full border-2 border-grey-900 px-4 py-2 text-sm font-bold transition ${active ? "bg-violet shadow-pop" : "bg-white text-grey-700 hover:bg-grey-100"}`;

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pill(!categoryId)} onClick={() => setCategoryId("")}>All</button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={pill(categoryId === c.id)} onClick={() => setCategoryId(c.id)} aria-pressed={categoryId === c.id}>{c.name}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="tag">Tag</label>
        <select id="tag" className="field" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Any tag</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-grey-700">
        <input type="checkbox" className="h-5 w-5 accent-violet" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
        In stock only
      </label>
      <button type="button" onClick={reset} className="text-sm font-semibold text-grey-500 underline underline-offset-4 hover:text-grey-900">Clear all filters</button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
      <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="label">Search</label>
            <input id="search" type="search" className="field" placeholder="Search brushes, watercolor…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="sm:w-56">
            <label htmlFor="sort" className="label">Sort by</label>
            <select id="sort" className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(sortStrategies).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </div>
          <button type="button" className="btn btn-ghost lg:hidden" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((v) => !v)}>
            {filtersOpen ? "Hide filters" : "Filters"}
          </button>
        </div>

        {filtersOpen && <div className="panel mt-5 p-5 lg:hidden">{filters}</div>}

        <p className="mt-6 text-sm text-grey-500" role="status" aria-live="polite">{results.length} product{results.length === 1 ? "" : "s"}</p>

        {results.length ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-8 xl:grid-cols-3">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="panel mt-6 border-dashed p-12 text-center">
            <p className="font-display text-xl font-semibold">Nothing matches just yet</p>
            <p className="mt-1 text-sm text-grey-500">Try clearing a filter or searching for something else.</p>
            <button type="button" className="btn btn-dark mt-5" onClick={reset}>Reset filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
