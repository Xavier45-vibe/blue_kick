import Link from "next/link";
import { footerLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-grey-900 bg-grey-900 text-grey-300">
      <div className="container-bk grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-black text-white">
            Blue<span className="text-violet">Kick</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-grey-400">
            A family-owned art supplies store. Premium quality, lively colour and a little glamour for every maker.
          </p>
          <div className="mt-5 flex gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-violet" />
            <span className="h-3 w-3 rounded-full bg-pink" />
            <span className="h-3 w-3 rounded-full bg-gold" />
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="mt-4 space-y-3 text-sm">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-medium transition hover:text-violet">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Say hello</p>
          <p className="mt-4 text-sm">hello@bluekick.store</p>
          <p className="mt-1 text-sm text-grey-400">Mon–Fri, 9am – 5pm</p>
        </div>
      </div>
      <div className="border-t border-grey-700">
        <p className="container-bk py-5 text-xs text-grey-500">© 2026 Blue Kick. Made with care by our family.</p>
      </div>
    </footer>
  );
}
