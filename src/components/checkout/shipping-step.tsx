import type { FormEvent } from "react";
import { formatMoney } from "@/lib/money";
import type { Quote } from "./shared";

interface Props {
  quote: Quote | null;
  methodId: string;
  setMethodId(v: string): void;
  note: string;
  setNote(v: string): void;
  onBack(): void;
  onNext(e: FormEvent): void;
}

export function ShippingStep({ quote, methodId, setMethodId, note, setNote, onBack, onNext }: Props) {
  return (
    <form onSubmit={onNext} className="space-y-5">
      <h2 className="text-2xl font-bold">Shipping method</h2>
      <fieldset className="space-y-3">
        <legend className="sr-only">Shipping method</legend>
        {quote?.methods.map((m) => (
          <label key={m.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-grey-900 p-4 transition ${methodId === m.id ? "bg-violet shadow-pop" : "bg-white"}`}>
            <span className="flex items-center gap-3">
              <input type="radio" name="ship" className="h-5 w-5 accent-violet" checked={methodId === m.id} onChange={() => setMethodId(m.id)} />
              <span>
                <span className="block font-semibold">{m.name} ({m.days[0]}–{m.days[1]} business days)</span>
                <span className="block text-sm text-grey-500">Arrives by {new Date(m.estimatedDelivery).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              </span>
            </span>
            <span className="font-bold">{m.price === 0 ? "Free" : formatMoney(m.price)}</span>
          </label>
        ))}
      </fieldset>
      <div>
        <label htmlFor="note" className="label">Gift message or order notes (optional)</label>
        <textarea id="note" rows={3} className="field" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary" disabled={!methodId}>Continue to payment</button>
      </div>
    </form>
  );
}
