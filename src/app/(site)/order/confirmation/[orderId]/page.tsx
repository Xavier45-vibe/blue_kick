import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatMoney } from "@/lib/money";
import { container } from "@/services/container";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export const dynamic = "force-dynamic";

export default function ConfirmationPage({ params }: PageProps<"/order/confirmation/[orderId]">) {
  return (
    <Suspense fallback={<p className="py-24 text-center text-grey-500">Loading your order…</p>}>
      <OrderDetails params={params} />
    </Suspense>
  );
}

async function OrderDetails({ params }: { params: PageProps<"/order/confirmation/[orderId]">["params"] }) {
  const { orderId } = await params;
  const order = await container.orders.findById(orderId);
  if (!order) notFound();

  return (
    <div className="container-bk max-w-3xl py-12 sm:py-16">
      <div className="text-center">
        <span className="mx-auto grid h-20 w-20 -rotate-6 place-items-center rounded-full border-2 border-grey-900 bg-success text-4xl font-black text-grey-900 shadow-pop" aria-hidden="true">✓</span>
        <h1 className="mt-6 text-4xl font-black sm:text-5xl">Thank you, {order.shippingAddress.firstName}!</h1>
        <p className="mt-2 text-grey-600">Order <strong>{order.number}</strong> is confirmed. A receipt is on its way to {order.email}.</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="card-pop p-5">
          <h2 className="text-lg font-bold">Delivery</h2>
          <p className="mt-2 text-sm text-grey-600">{order.shippingMethodName} · arrives by {new Date(order.estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <p className="mt-3 text-sm text-grey-600">{order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />{order.shippingAddress.line1}<br />{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}</p>
        </div>
        <div className="card-pop p-5">
          <h2 className="text-lg font-bold">Payment</h2>
          <p className="mt-2 text-sm text-grey-600">{order.paymentMethod} · {order.paymentStatus}</p>
          <p className="mt-1 text-xs text-grey-400">Ref {order.paymentReference}</p>
        </div>
      </div>

      <ul className="panel mt-6 divide-y-2 divide-grey-900 overflow-hidden">
        {order.items.map((i) => (
          <li key={i.productId} className="flex justify-between gap-4 p-4 text-sm">
            <span>{i.name} × {i.quantity}</span>
            <span className="font-semibold">{formatMoney(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
        <li className="space-y-1 bg-grey-50 p-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{formatMoney(order.discount)}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</span></div>
          <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>{formatMoney(order.total)}</span></div>
        </li>
      </ul>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
        <Link href="/contact" className="btn btn-ghost">Need help?</Link>
      </div>
    </div>
  );
}
