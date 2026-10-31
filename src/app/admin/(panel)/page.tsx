import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMoney } from "@/lib/money";
import { dashboardStats } from "@/repositories/admin";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const [s, sp] = await Promise.all([dashboardStats(), searchParams]);
  const cards = [
    { label: "Today's Revenue", value: formatMoney(s.revenueToday), bg: "bg-violet" },
    { label: "Orders Today", value: String(s.ordersToday), bg: "bg-gold" },
    { label: "Low Stock Items", value: String(s.lowStock), bg: s.lowStock > 0 ? "bg-pink" : "bg-white" },
    { label: "Newsletter Subscribers", value: String(s.subscribers), bg: "bg-white" },
  ];
  return (
    <div className="space-y-8">
      {sp.denied === "1" && <p role="alert" className="rounded-xl border-2 border-grey-900 bg-error p-3 text-sm font-bold text-white">You do not have permission to open that page.</p>}

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`card-pop ${c.bg} p-5`}>
            <p className="text-xs font-extrabold uppercase tracking-wider text-grey-700">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-black text-grey-900">{c.value}</p>
          </div>
        ))}
      </section>

      <section aria-label="Quick actions" className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">Add Product</Link>
        <Link href="/admin/orders" className="btn btn-ghost btn-sm">View All Orders</Link>
        <a href="/admin/newsletter/export" className="btn btn-ghost btn-sm">Export Subscribers</a>
      </section>

      <section className="panel overflow-hidden" aria-labelledby="recent">
        <div className="flex items-center justify-between border-b-2 border-grey-900 px-5 py-4">
          <h2 id="recent" className="text-xl font-black">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold underline underline-offset-4">See all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Fulfillment</th></tr></thead>
            <tbody>
              {s.recent.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-grey-500">No orders yet. They will appear here as customers check out.</td></tr>}
              {s.recent.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} className="font-bold underline underline-offset-4">{o.number}</Link></td>
                  <td>{o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td>{o.email}</td>
                  <td className="font-bold">{formatMoney(o.total)}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                  <td><StatusBadge status={o.fulfillmentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
