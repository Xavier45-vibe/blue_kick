"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/actions/categories";
import { ConfirmDialog } from "./confirm";
import { useToast } from "./toast";
import { useToastAction } from "./use-action";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  position: number;
  isActive: boolean;
  products: number;
}

const blank: CategoryRow = { id: "", name: "", slug: "", description: "", position: 0, isActive: true, products: 0 };

export function CategoriesManager({ rows }: { rows: CategoryRow[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [editing, setEditing] = useState<CategoryRow>(blank);
  const [confirm, setConfirm] = useState<CategoryRow | null>(null);
  const [pending, start] = useTransition();
  const { formAction, pending: saving } = useToastAction(async (prev, fd) => {
    const res = await saveCategory(prev, fd);
    if (res.ok) {
      setEditing(blank);
      router.refresh();
    }
    return res;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Products</th><th>Visible</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.position}</td>
                <td className="font-bold">{r.name}</td>
                <td className="font-mono text-xs">{r.slug}</td>
                <td>{r.products}</td>
                <td>{r.isActive ? "Yes" : "No"}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(r)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirm(r)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form key={editing.id || "new"} action={formAction} className="panel h-fit space-y-4 p-5">
        <h2 className="text-lg font-black">{editing.id ? "Edit category" : "New category"}</h2>
        <input type="hidden" name="id" value={editing.id} />
        <div><label htmlFor="cname" className="label">Name</label><input id="cname" name="name" className="field" required defaultValue={editing.name} /></div>
        <div><label htmlFor="cslug" className="label">Slug (optional)</label><input id="cslug" name="slug" className="field font-mono text-sm" defaultValue={editing.slug} /></div>
        <div><label htmlFor="cdesc" className="label">Description</label><textarea id="cdesc" name="description" rows={2} className="field" defaultValue={editing.description} /></div>
        <div><label htmlFor="cpos" className="label">Display order</label><input id="cpos" name="position" inputMode="numeric" className="field" defaultValue={editing.position} /></div>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" name="isActive" defaultChecked={editing.isActive} className="h-5 w-5 accent-violet" /> Visible in the shop</label>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary flex-1" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          {editing.id && <button type="button" className="btn btn-ghost" onClick={() => setEditing(blank)}>Cancel</button>}
        </div>
      </form>

      <ConfirmDialog
        open={confirm !== null}
        title={`Delete “${confirm?.name}”?`}
        busy={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm && start(async () => { const r = await deleteCategory(confirm.id); notify(r.ok ? "success" : "error", r.message); setConfirm(null); router.refresh(); })}
      >
        This cannot be undone. A category that still contains products cannot be deleted.
      </ConfirmDialog>
    </div>
  );
}
