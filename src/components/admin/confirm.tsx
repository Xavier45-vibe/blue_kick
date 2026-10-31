"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Confirmation dialog for every destructive action (admin UX guideline). */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onCancel} onCancel={onCancel} className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border-2 border-grey-900 bg-white p-0 shadow-pop-lg backdrop:bg-grey-900/60">
      <div className="p-6">
        <h2 className="text-xl font-black">{title}</h2>
        <div className="mt-2 text-sm text-grey-600">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} autoFocus>Cancel</button>
          <button type="button" className="btn btn-danger btn-sm" onClick={onConfirm} disabled={busy}>{busy ? "Working…" : confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
}
