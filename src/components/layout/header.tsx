"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { navLinks } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b-2 border-grey-900 bg-white">
      <div className="container-bk flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)} aria-label="Blue Kick home">
          <span className="grid h-10 w-10 -rotate-6 place-items-center rounded-xl border-2 border-grey-900 bg-gold font-display text-xl font-black text-grey-900 shadow-pop transition group-hover:rotate-6">B</span>
          <span className="font-display text-2xl font-black tracking-tight text-grey-900">
            Blue<span className="text-violet">Kick</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${isActive(l.href) ? "border-grey-900 bg-violet text-grey-900" : "border-transparent text-grey-600 hover:border-grey-900 hover:text-grey-900"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="btn btn-gold btn-sm relative !min-h-11 !px-4" aria-label={`Cart, ${ready ? count : 0} items`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 12H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-grey-900 px-1 text-[11px] font-bold text-white">{ready ? count : 0}</span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm !min-h-11 !w-11 !p-0 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t-2 border-grey-900 bg-grey-50 md:hidden">
          <ul className="container-bk flex flex-col gap-2 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-2xl border-2 border-grey-900 px-4 py-3.5 text-lg font-bold ${isActive(l.href) ? "bg-violet shadow-pop" : "bg-white"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
