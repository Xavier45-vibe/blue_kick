"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Art } from "@/components/ui/art";
import { formatMoney } from "@/lib/money";
import { useCart } from "./cart-context";

export interface CartProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  tone: [string, string];
}

export function CartView({ products, freeThreshold }: { products: CartProduct[]; freeThreshold: number }) {
  const { lines, ready, setQuantity, remove } = useCart();
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const items = lines.flatMap((l) => {
    const p = byId.get(l.productId);
    return p ? [{ ...l, product: p }] : [];
  });
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (!ready) return <p className="py-20 text-center text-grey-500">Loading your cart…</p>;

  if (!items.length) {
    return (
      <div className="panel border-dashed px-6 py-20 text-center">
        <p className="font-display text-2xl font-bold">Your cart is empty</p>
        <p className="mt-2 text-grey-500">Let's fix that with something lovely.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  const remaining = freeThreshold - subtotal;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <ul className="panel divide-y-2 divide-grey-900 px-4">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-4 py-5">
            <Art tone={product.tone} label={product.name} className="h-24 w-24 shrink-0 rounded-xl border-2 border-grey-900 sm:h-28 sm:w-28" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <Link href={`/shop/${product.slug}`} className="font-display text-lg font-semibold leading-snug hover:text-grey-600">{product.name}</Link>
                <span className="font-bold">{formatMoney(product.price * quantity)}</span>
              </div>
              <p className="text-sm text-grey-500">{formatMoney(product.price)} each</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex h-10 items-center rounded-full border-2 border-grey-900 bg-white" role="group" aria-label={`Quantity for ${product.name}`}>
                  <button type="button" className="h-10 w-10" aria-label="Decrease quantity" onClick={() => setQuantity(product.id, quantity - 1)}>−</button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button type="button" className="h-10 w-10 disabled:opacity-40" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity(product.id, quantity + 1)}>+</button>
                </div>
                <button type="button" className="min-h-10 text-sm text-grey-500 underline underline-offset-4 hover:text-red-500" onClick={() => remove(product.id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="card-pop h-fit bg-gold p-6 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between text-grey-500"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
        </dl>
        <p className="mt-4 rounded-xl border-2 border-grey-900 bg-white p-3 text-xs font-semibold text-grey-800">
          {remaining > 0 ? `Add ${formatMoney(remaining)} more for free standard shipping.` : "You've unlocked free standard shipping!"}
        </p>
        <Link href="/checkout" className="btn btn-primary mt-5 w-full">Proceed to checkout</Link>
        <Link href="/shop" className="btn btn-ghost mt-3 w-full">Continue shopping</Link>
      </aside>
    </div>
  );
}
