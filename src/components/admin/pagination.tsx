import Link from "next/link";

/** Server-rendered pagination that preserves the other query params. */
export function Pagination({ page, pages, total, basePath, params }: { page: number; pages: number; total: number; basePath: string; params: Record<string, string | undefined> }) {
  const href = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
    q.set("page", String(p));
    return `${basePath}?${q.toString()}`;
  };
  return (
    <nav className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-grey-600">{total} result{total === 1 ? "" : "s"} · page {page} of {pages}</p>
      <div className="flex gap-2">
        {page > 1 ? <Link href={href(page - 1)} className="btn btn-ghost btn-sm">← Previous</Link> : <span className="btn btn-ghost btn-sm opacity-40" aria-disabled="true">← Previous</span>}
        {page < pages ? <Link href={href(page + 1)} className="btn btn-ghost btn-sm">Next →</Link> : <span className="btn btn-ghost btn-sm opacity-40" aria-disabled="true">Next →</span>}
      </div>
    </nav>
  );
}
