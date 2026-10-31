import { requireAdmin } from "@/lib/session";
import { listSubscribers } from "@/repositories/admin";

export const dynamic = "force-dynamic";

/** CSV export. Guards against spreadsheet formula injection by prefixing risky cells with an apostrophe. */
const cell = (v: string) => {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET() {
  await requireAdmin();
  const rows = await listSubscribers();
  const csv = ["email,signup_date,source", ...rows.map((r) => [cell(r.email), r.createdAt.toISOString(), cell(r.source)].join(","))].join("\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="bluekick-subscribers.csv"' },
  });
}
