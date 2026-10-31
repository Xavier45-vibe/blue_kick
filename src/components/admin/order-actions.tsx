"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addOrderNote, markShipped, updateOrderStatus } from "@/app/admin/actions/orders";
import { useToast } from "./toast";
import { useToastAction } from "./use-action";

export function OrderHeaderActions({ id, fulfillment, payment }: { id: string; fulfillment: string; payment: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, start] = useTransition();

  const change = (kind: "fulfillment" | "payment", value: string) =>
    start(async () => {
      const r = await updateOrderStatus(id, kind, value);
      notify(r.ok ? "success" : "error", r.message);
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="ful" className="label">Fulfillment</label>
        <select id="ful" className="field !min-h-10" value={fulfillment} disabled={pending} onChange={(e) => change("fulfillment", e.target.value)}>
          <option value="unfulfilled">Unfulfilled</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label htmlFor="pay" className="label">Payment</label>
        <select id="pay" className="field !min-h-10" value={payment} disabled={pending} onChange={(e) => change("payment", e.target.value)}>
          <option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
        </select>
      </div>
      <button type="button" className="btn btn-ghost btn-sm !min-h-10" onClick={() => window.print()}>Print Packing Slip</button>
    </div>
  );
}

export function ShipForm({ id, tracking, shipped }: { id: string; tracking?: string; shipped: boolean }) {
  const router = useRouter();
  const { formAction, pending } = useToastAction(async (prev, fd) => {
    const r = await markShipped(prev, fd);
    if (r.ok) router.refresh();
    return r;
  });
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="tracking" className="label">Tracking number</label>
      <input id="tracking" name="tracking" className="field" defaultValue={tracking} required />
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Saving…" : shipped ? "Update tracking & re-send email" : "Mark as Shipped"}</button>
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const router = useRouter();
  const { formAction, pending } = useToastAction(async (prev, fd) => {
    const r = await addOrderNote(prev, fd);
    if (r.ok) router.refresh();
    return r;
  });
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="body" className="label">Internal note</label>
      <textarea id="body" name="body" rows={3} className="field" required />
      <button type="submit" className="btn btn-dark btn-sm" disabled={pending}>Add note</button>
    </form>
  );
}
