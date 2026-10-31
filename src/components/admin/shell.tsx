"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ToastProvider } from "./toast";

const titles: [string, string][] = [
  ["/admin/products/new", "Add Product"],
  ["/admin/products/categories", "Categories"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/customers", "Customers"],
  ["/admin/newsletter", "Newsletter"],
  ["/admin/content/landing", "Landing Page"],
  ["/admin/content/team", "Team Members"],
  ["/admin/content/about", "About Page"],
  ["/admin/settings", "Settings"],
];

export function AdminShell({ user, children }: { user: { name: string; role: string }; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const title = titles.find(([p]) => pathname.startsWith(p))?.[1] ?? "Dashboard";

  function search(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/admin/products?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-grey-50 lg:pl-[260px]">
        <Sidebar user={user} open={open} onClose={() => setOpen(false)} />

        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b-2 border-grey-900 bg-white px-4 sm:px-6">
          <button type="button" className="btn btn-ghost btn-sm !w-10 !p-0 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <h1 className="truncate font-display text-xl font-black sm:text-2xl">{title}</h1>

          <form onSubmit={search} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
            <label htmlFor="admin-search" className="sr-only">Search products</label>
            <input id="admin-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field !min-h-10 !py-1.5 text-sm" />
          </form>

          <Link href="/" target="_blank" className="btn btn-ghost btn-sm ml-auto hidden sm:inline-flex md:ml-0" title="Open the storefront">View site ↗</Link>
          <button type="button" className="btn btn-ghost btn-sm relative !w-10 !p-0" aria-label="Notifications" onClick={() => router.push("/admin/orders?status=unfulfilled")} title="Unfulfilled orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 19a2 2 0 0 0 4 0" /></svg>
          </button>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ <span className="hidden sm:inline">Add Product</span></Link>
        </header>

        <div className="mx-auto max-w-[1400px] p-4 sm:p-6">{children}</div>
      </div>
    </ToastProvider>
  );
}
