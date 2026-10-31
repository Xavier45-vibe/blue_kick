"use client";

import { useState } from "react";
import { slugify } from "@/lib/slug";
import type { ProductFormData } from "./product-form-types";

/** Left column of the product form: basics, pricing, inventory, organisation. */
export function ProductFormMain({ initial, categories }: { initial: ProductFormData; categories: { id: string; name: string }[] }) {
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const [short, setShort] = useState(initial.shortDescription);

  return (
    <>
      <section className="panel space-y-5 p-5 sm:p-6">
        <h2 className="text-xl font-black">Basics</h2>
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" className="field" required value={name} onChange={(e) => { setName(e.target.value); if (!slugEdited) setSlug(slugify(e.target.value)); }} />
        </div>
        <div>
          <label htmlFor="slug" className="label">Slug {slugEdited ? "" : "(auto)"}</label>
          <input id="slug" name="slug" className="field font-mono text-sm" value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }} />
        </div>
        <div>
          <label htmlFor="shortDescription" className="label">Short description <span className="font-semibold normal-case text-grey-500">({short.length}/160)</span></label>
          <textarea id="shortDescription" name="shortDescription" rows={2} maxLength={160} className="field" required value={short} onChange={(e) => setShort(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className="label">Description (Markdown supported)</label>
          <textarea id="description" name="description" rows={9} className="field font-mono text-sm" required defaultValue={initial.description} />
        </div>
      </section>

      <section className="panel grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="text-xl font-black sm:col-span-2">Pricing & inventory</h2>
        <div><label htmlFor="price" className="label">Price ($)</label><input id="price" name="price" inputMode="decimal" className="field" required defaultValue={initial.price} /></div>
        <div><label htmlFor="compareAtPrice" className="label">Compare-at price ($)</label><input id="compareAtPrice" name="compareAtPrice" inputMode="decimal" className="field" defaultValue={initial.compareAtPrice} /></div>
        <div><label htmlFor="sku" className="label">SKU</label><input id="sku" name="sku" className="field font-mono text-sm" required defaultValue={initial.sku} /></div>
        <div><label htmlFor="weight" className="label">Weight (g)</label><input id="weight" name="weight" inputMode="numeric" className="field" defaultValue={initial.weight} /></div>
        <div><label htmlFor="quantity" className="label">Stock quantity</label><input id="quantity" name="quantity" inputMode="numeric" className="field" defaultValue={initial.quantity} /></div>
        <div><label htmlFor="lowStockThreshold" className="label">Low-stock threshold</label><input id="lowStockThreshold" name="lowStockThreshold" inputMode="numeric" className="field" defaultValue={initial.lowStockThreshold} /></div>
      </section>

      <section className="panel grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <h2 className="text-xl font-black sm:col-span-2">Organisation</h2>
        <div>
          <label htmlFor="categoryId" className="label">Category</label>
          <select id="categoryId" name="categoryId" className="field" required defaultValue={initial.categoryId}>
            <option value="" disabled>Select…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label htmlFor="tags" className="label">Tags (comma separated)</label><input id="tags" name="tags" className="field" placeholder="watercolor, beginner" defaultValue={initial.tags} /></div>
      </section>
    </>
  );
}
