"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";

export function AddToCart({ productId, disabled, max }: { productId: string; disabled: boolean; max: number }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 items-center justify-between rounded-full border-2 border-grey-900 bg-white sm:w-40" role="group" aria-label="Quantity">
          <button type="button" className="h-12 w-12 text-xl" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={disabled}>−</button>
          <span className="font-semibold" aria-live="polite">{qty}</span>
          <button type="button" className="h-12 w-12 text-xl" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={disabled}>+</button>
        </div>
        <button type="button" className="btn btn-primary flex-1" disabled={disabled} onClick={onAdd}>
          {disabled ? "Sold out" : "Add to cart"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm text-grey-600">
        {added && (<>Added to your cart. <Link href="/cart" className="font-semibold underline">View cart</Link></>)}
      </p>
    </div>
  );
}
