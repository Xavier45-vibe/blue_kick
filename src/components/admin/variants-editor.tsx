"use client";

import { useState } from "react";

export interface VariantRow {
  name: string;
  sku: string;
  price: string;
  qty: string;
}

/** Collapsible variants table. Serialises to one hidden JSON field for the server action. */
export function VariantsEditor({ initial }: { initial: VariantRow[] }) {
  const [open, setOpen] = useState(initial.length > 0);
  const [rows, setRows] = useState<VariantRow[]>(initial);
  const set = (i: number, k: keyof VariantRow, v: string) => setRows((r) => r.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  return (
    <section className="panel">
      <button type="button" className="flex w-full items-center justify-between px-5 py-4 text-left" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="text-lg font-black">Variants <span className="text-sm font-semibold text-grey-500">({rows.length})</span></span>
        <span aria-hidden="true" className="text-2xl font-black">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t-2 border-grey-900 p-5">
          {rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>SKU</th><th>Price ($)</th><th>Stock</th><th /></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td><input aria-label="Variant name" className="field !min-h-9 !py-1" value={r.name} onChange={(e) => set(i, "name", e.target.value)} placeholder="Set of 12" /></td>
                      <td><input aria-label="Variant SKU" className="field !min-h-9 !py-1" value={r.sku} onChange={(e) => set(i, "sku", e.target.value)} /></td>
                      <td><input aria-label="Variant price" inputMode="decimal" className="field !min-h-9 !py-1" value={r.price} onChange={(e) => set(i, "price", e.target.value)} /></td>
                      <td><input aria-label="Variant stock" inputMode="numeric" className="field !min-h-9 !py-1" value={r.qty} onChange={(e) => set(i, "qty", e.target.value)} /></td>
                      <td><button type="button" className="text-xs font-bold text-error underline" onClick={() => setRows((x) => x.filter((_, idx) => idx !== i))}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => setRows((r) => [...r, { name: "", sku: "", price: "", qty: "0" }])}>+ Add variant</button>
        </div>
      )}
      <input type="hidden" name="variants" value={JSON.stringify(rows)} />
    </section>
  );
}
