"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeSubscriber } from "@/app/admin/actions/content";
import { ConfirmDialog } from "./confirm";
import { useToast } from "./toast";

export interface SubscriberRow {
  id: string;
  email: string;
  source: string;
  date: string;
}

export function SubscribersTable({ rows, q }: { rows: SubscriberRow[]; q?: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const [target, setTarget] = useState<SubscriberRow | null>(null);
  const [pending, start] = useTransition();

  return (
    <>
      <div className="panel mb-5 flex flex-wrap items-end gap-3 p-4">
        <form className="flex flex-1 flex-wrap items-end gap-3" role="search">
          <div className="min-w-48 flex-1"><label htmlFor="q" className="label">Search</label><input id="q" name="q" defaultValue={q} placeholder="email@example.com" className="field" /></div>
          <button type="submit" className="btn btn-dark">Search</button>
        </form>
        <a href="/admin/newsletter/export" className="btn btn-primary">Export CSV</a>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Email</th><th>Signed up</th><th>Source</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-grey-500">No subscribers found.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-semibold">{r.email}</td><td>{r.date}</td><td>{r.source}</td>
                <td><span className="sticker sticker-green">subscribed</span></td>
                <td className="text-right"><button type="button" className="btn btn-danger btn-sm" onClick={() => setTarget(r)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={target !== null}
        title="Remove subscriber?"
        confirmLabel="Remove"
        busy={pending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && start(async () => { const r = await removeSubscriber(target.id); notify(r.ok ? "success" : "error", r.message); setTarget(null); router.refresh(); })}
      >
        {target?.email} will no longer receive your emails.
      </ConfirmDialog>
    </>
  );
}
