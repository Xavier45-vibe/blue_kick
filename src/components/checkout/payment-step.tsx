import type { FormEvent } from "react";
import type { Address } from "@/domain/order";
import { formatMoney } from "@/lib/money";
import { AddressFields, type Quote } from "./shared";

interface Props {
  quote: Quote | null;
  paymentId: string;
  setPaymentId(v: string): void;
  sameBilling: boolean;
  setSameBilling(v: boolean): void;
  billing: Address;
  setB(k: keyof Address): (v: string) => void;
  busy: boolean;
  total: number;
  onBack(): void;
  onSubmit(e: FormEvent): void;
}

export function PaymentStep({ quote, paymentId, setPaymentId, sameBilling, setSameBilling, billing, setB, busy, total, onBack, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold">Payment</h2>
      <fieldset className="space-y-3">
        <legend className="sr-only">Payment method</legend>
        {quote?.payments.map((p) => (
          <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-grey-900 p-4 ${paymentId === p.id ? "bg-violet shadow-pop" : "bg-white"}`}>
            <input type="radio" name="pay" className="h-5 w-5 accent-violet" checked={paymentId === p.id} onChange={() => setPaymentId(p.id)} />
            <span className="font-semibold">{p.label}</span>
          </label>
        ))}
      </fieldset>
      <p className="rounded-xl border-2 border-dashed border-grey-900 bg-white p-3 text-xs text-grey-600">Without a PAYSTACK_SECRET_KEY configured, payments run in simulated mode and no card is charged.</p>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-violet" checked={sameBilling} onChange={(e) => setSameBilling(e.target.checked)} /> Billing address same as shipping
      </label>
      {!sameBilling && <AddressFields prefix="b" value={billing} onChange={setB} />}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary" disabled={busy || !paymentId}>{busy ? "Placing order…" : `Place order · ${formatMoney(total)}`}</button>
      </div>
    </form>
  );
}
