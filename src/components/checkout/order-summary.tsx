import { useState } from "react";
import { formatMoney } from "@/lib/money";
import type { Quote } from "./shared";

interface Props {
  quote: Quote | null;
  promo: string;
  onApplyPromo(code: string): void;
  shipping: number | null;
  total: number;
}

export function OrderSummary({ quote, promo, onApplyPromo, shipping, total }: Props) {
  const [input, setInput] = useState("");
  return (
    <aside className="card-pop h-fit bg-gold p-6 lg:sticky lg:top-28">
      <h2 className="text-xl font-bold">Order summary</h2>
      <div className="mt-4 flex gap-2">
        <input aria-label="Promo code" className="field" placeholder="Promo code" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="button" className="btn btn-dark" onClick={() => onApplyPromo(input.trim())}>Apply</button>
      </div>
      {promo && quote && (
        <p className={`mt-2 text-xs ${quote.promoValid ? "text-emerald-600" : "text-red-500"}`}>
          {quote.promoValid ? `Code ${promo.toUpperCase()} applied` : "That code isn't valid"}
        </p>
      )}
      {quote && (
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(quote.subtotal)}</dd></div>
          {quote.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{formatMoney(quote.discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === null ? "—" : shipping === 0 ? "Free" : formatMoney(shipping)}</dd></div>
          <div className="flex justify-between border-t-2 border-grey-900 pt-3 text-lg font-black"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
        </dl>
      )}
    </aside>
  );
}
