"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type Kind = "success" | "error";
interface Toast {
  id: number;
  kind: Kind;
  message: string;
}

const ToastContext = createContext<{ notify: (kind: Kind, message: string) => void } | null>(null);

/** Toast / snackbar notifications for success and error states (admin UX guideline). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);

  const notify = useCallback((kind: Kind, message: string) => {
    if (!message) return;
    const id = next.current++;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto rise rounded-xl border-2 border-grey-900 px-4 py-3 text-sm font-bold shadow-pop ${t.kind === "error" ? "bg-error text-white" : "bg-success text-grey-900"}`}
          >
            {t.kind === "error" ? "⚠ " : "✓ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
