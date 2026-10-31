import Link from "next/link";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMoney } from "@/lib/money";
import { listOrders } from "@/repositories/admin";

export const metadata = { title: "Orders" };

type Addr = { firstName?: string; lastName?: string };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const q = str(sp.q), status = str(sp.status), from = str(sp.from), to = str(sp.to);
  const { rows, total, pages, page } = await listOrders({ q, status, from, to, page: Number(str(sp.page)) || 1 });

  return (
    <div>
      <form className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_11rem_11rem_auto]" role="search">
        <div><label htmlFor="q" className="label">Order #, name or email</label><input id="q" name="q" defaultValue={q} className="field" /></div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" defaultValue={status ?? ""} className="field">
            <option value="">All</option><option value="unfulfilled">Unfulfilled</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div><label htmlFor="from" className="label">From</label><input id="from" type="date" name="from" defaultValue={from} className="field" /></div>
        <div><label htmlFor="to" className="label">To</label><input id="to" type="date" name="to" defaultValue={to} className="field" /></div>
        <button type="submit" className="btn btn-dark self-end">Filter</button>
      </form>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Fulfillment</th><th /></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-grey-500">No orders match these filters.</td></tr>}
            {rows.map((o) => {
              const a = o.shippingAddress as Addr;
              return (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} className="font-bold underline underline-offset-4">{o.number}</Link></td>
                  <td>{o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td><span className="block font-semibold">{a.firstName} {a.lastName}</span><span className="text-xs text-grey-500">{o.email}</span></td>
                  <td className="font-bold">{formatMoney(o.total)}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                  <td><StatusBadge status={o.fulfillmentStatus} /></td>
                  <td className="text-right"><Link href={`/admin/orders/${o.id}`} className="btn btn-ghost btn-sm">Open</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={pages} total={total} basePath="/admin/orders" params={{ q, status, from, to }} />
    </div>
  );
}
