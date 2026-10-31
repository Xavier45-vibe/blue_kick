import { SubscribersTable } from "@/components/admin/subscribers-table";
import { listSubscribers } from "@/repositories/admin";

export const metadata = { title: "Newsletter" };

export default async function NewsletterPage({ searchParams }: PageProps<"/admin/newsletter">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" && sp.q ? sp.q : undefined;
  const rows = await listSubscribers(q);
  return (
    <SubscribersTable
      q={q}
      rows={rows.map((r) => ({ id: r.id, email: r.email, source: r.source, date: r.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }))}
    />
  );
}
