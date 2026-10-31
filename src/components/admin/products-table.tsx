"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProducts, duplicateProduct, setProductsStatus } from "@/app/admin/actions/product-bulk";
import { formatMoney } from "@/lib/money";
import { ConfirmDialog } from "./confirm";
import { StatusBadge } from "./status-badge";
import { useToast } from "./toast";

export interface ProductRowData {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  status: string;
  category: string;
  image: string | null;
  tone: [string, string];
}

export function ProductsTable({ rows }: { rows: ProductRowData[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [pending, start] = useTransition();

  const all = rows.length > 0 && selected.length === rows.length;
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function run(fn: () => Promise<{ ok: boolean; message: string }>) {
    start(async () => {
      const res = await fn();
      notify(res.ok ? "success" : "error", res.message);
      setSelected([]);
      setConfirm(null);
      router.refresh();
    });
  }

  return (
    <>
      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border-2 border-grey-900 bg-gold px-4 py-3" role="region" aria-label="Bulk actions">
          <p className="text-sm font-black">{selected.length} selected</p>
          <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => run(() => setProductsStatus(selected, "active"))}>Publish</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => run(() => setProductsStatus(selected, "draft"))}>Move to draft</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => run(() => setProductsStatus(selected, "archived"))}>Archive</button>
          <button type="button" className="btn btn-danger btn-sm" disabled={pending} onClick={() => setConfirm(selected)}>Delete</button>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-10"><input type="checkbox" aria-label="Select all" className="h-4 w-4 accent-violet" checked={all} onChange={() => setSelected(all ? [] : rows.map((r) => r.id))} /></th>
                <th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-grey-500">No products match these filters.</td></tr>}
              {rows.map((r) => {
                const low = r.quantity <= r.lowStockThreshold;
                return (
                  <tr key={r.id}>
                    <td><input type="checkbox" aria-label={`Select ${r.name}`} className="h-4 w-4 accent-violet" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} /></td>
                    <td>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {r.image ? <img src={r.image} alt="" className="h-11 w-11 rounded-lg border-2 border-grey-900 object-cover" /> : <span className="h-11 w-11 shrink-0 rounded-lg border-2 border-grey-900" style={{ background: `linear-gradient(135deg, ${r.tone[0]}, ${r.tone[1]})` }} aria-hidden="true" />}
                        <div className="min-w-0">
                          <Link href={`/admin/products/${r.id}`} className="block truncate font-bold underline-offset-4 hover:underline">{r.name}</Link>
                          <span className="text-xs text-grey-500">{r.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{r.sku}</td>
                    <td className="font-bold">{formatMoney(r.price)}</td>
                    <td><span className={low ? "font-black text-error" : ""}>{r.quantity}</span>{low && <span className="ml-2 sticker sticker-pink">Low</span>}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${r.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => run(() => duplicateProduct(r.id))}>Duplicate</button>
                        <button type="button" className="btn btn-danger btn-sm" disabled={pending} onClick={() => setConfirm([r.id])}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog open={confirm !== null} title="Delete products?" busy={pending} onCancel={() => setConfirm(null)} onConfirm={() => confirm && run(() => deleteProducts(confirm))}>
        {confirm?.length ?? 0} product(s) will be removed. Any that appear in past orders will be archived instead so your order history stays intact.
      </ConfirmDialog>
    </>
  );
}
