import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm, OrderHeaderActions, ShipForm } from "@/components/admin/order-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMoney } from "@/lib/money";
import { getOrderDetail } from "@/repositories/admin";

export const metadata = { title: "Order" };

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const detail = await getOrderDetail(id);
  if (!detail) notFound();
  const { order: o, notes } = detail;
  const s = o.shippingAddress;
  const b = o.billingAddress;

  return (
    <div className="space-y-6">
      <div className="panel flex flex-wrap items-start justify-between gap-4 p-5 print:border-0">
        <div>
          <Link href="/admin/orders" className="text-sm font-bold underline underline-offset-4 print:hidden">← All orders</Link>
          <h2 className="mt-1 text-3xl font-black">{o.number}</h2>
          <p className="text-sm text-grey-500">Placed {new Date(o.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
          <div className="mt-2 flex gap-2"><StatusBadge status={o.paymentStatus} /><StatusBadge status={o.fulfillmentStatus} /></div>
        </div>
        <div className="print:hidden"><OrderHeaderActions id={o.id} fulfillment={o.fulfillmentStatus} payment={o.paymentStatus} /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="panel overflow-x-auto">
            <table className="admin-table">
              <thead><tr><th>Item</th><th>SKU</th><th>Price</th><th>Qty</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                {o.items.map((i) => (
                  <tr key={i.productId}>
                    <td className="font-bold">{i.name}</td><td className="font-mono text-xs">{i.sku}</td><td>{formatMoney(i.unitPrice)}</td><td>{i.quantity}</td>
                    <td className="text-right font-bold">{formatMoney(i.unitPrice * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="ml-auto max-w-xs space-y-1 p-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(o.subtotal)}</dd></div>
              {o.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatMoney(o.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping ({o.shippingMethodName})</dt><dd>{formatMoney(o.shipping)}</dd></div>
              <div className="flex justify-between border-t-2 border-grey-900 pt-2 text-lg font-black"><dt>Total</dt><dd>{formatMoney(o.total)}</dd></div>
              <div className="flex justify-between text-xs text-grey-500"><dt>{o.paymentMethod}</dt><dd className="font-mono">{o.paymentReference}</dd></div>
            </dl>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="panel p-5">
              <h3 className="text-lg font-black">Customer</h3>
              <p className="mt-2 text-sm">{s.firstName} {s.lastName}</p>
              <p className="text-sm text-grey-600">{o.email}</p>
              {s.phone && <p className="text-sm text-grey-600">{s.phone}</p>}
            </div>
            <div className="panel p-5">
              <h3 className="text-lg font-black">Shipping address</h3>
              <address className="mt-2 text-sm not-italic text-grey-600">{s.line1}{s.line2 ? `, ${s.line2}` : ""}<br />{s.city}, {s.region} {s.postalCode}<br />{s.country}</address>
              {b.line1 !== s.line1 && <p className="mt-2 text-xs text-grey-500">Billing: {b.line1}, {b.city}</p>}
            </div>
          </section>
          {o.note && <section className="panel bg-gold p-5"><h3 className="font-black">Customer note</h3><p className="mt-1 text-sm">{o.note}</p></section>}
        </div>

        <div className="space-y-6 print:hidden">
          <section className="panel p-5"><h3 className="mb-3 text-lg font-black">Shipping</h3><ShipForm id={o.id} tracking={o.trackingNumber} shipped={o.fulfillmentStatus === "shipped"} /></section>
          <section className="panel p-5">
            <h3 className="mb-3 text-lg font-black">Timeline & notes</h3>
            <NoteForm id={o.id} />
            <ol className="mt-5 space-y-3 border-l-2 border-grey-900 pl-4">
              {notes.map((n) => (
                <li key={n.id} className="text-sm">
                  <p>{n.body}</p>
                  <p className="text-xs text-grey-500">{n.author} · {n.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                </li>
              ))}
              <li className="text-sm"><p>Order placed.</p><p className="text-xs text-grey-500">Customer · {new Date(o.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p></li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
