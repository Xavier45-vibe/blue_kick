"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions/auth";
import { adminNav } from "./nav";

export function Sidebar({ user, open, onClose }: { user: { name: string; role: string }; open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const isSuper = user.role === "SUPER_ADMIN";
  const exact = (href: string) => pathname === href;
  const within = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-grey-900/60 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-grey-800 text-grey-300 transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Admin navigation"
      >
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 border-b border-grey-700 px-5 py-5">
          <span className="grid h-10 w-10 -rotate-6 place-items-center rounded-xl border-2 border-grey-900 bg-gold font-display text-xl font-black text-grey-900">B</span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-black text-white">Blue Kick</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-violet">Admin</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {adminNav.filter((i) => !i.superOnly || isSuper).map((item) => {
              const active = within(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.children ? item.children[0].href : item.href}
                    onClick={onClose}
                    aria-current={active && !item.children ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-violet text-grey-900" : "hover:bg-grey-700 hover:text-white"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
                    {item.label}
                  </Link>
                  {item.children && active && (
                    <ul className="ml-5 mt-1 space-y-0.5 border-l-2 border-grey-700 pl-3">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={onClose} className={`block rounded-lg px-3 py-1.5 text-[13px] font-semibold ${exact(c.href) ? "text-gold" : "text-grey-400 hover:text-white"}`}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-grey-700 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-grey-900 bg-pink font-black text-grey-900" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{user.name}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">{isSuper ? "Super Admin" : "Store Manager"}</p>
            </div>
          </div>
          <form action={logout} className="mt-3">
            <button type="submit" className="btn btn-ghost btn-sm w-full">Log out</button>
          </form>
        </div>
      </aside>
    </>
  );
}
