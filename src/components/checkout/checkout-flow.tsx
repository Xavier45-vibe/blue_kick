"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/cart-context";
import type { Address } from "@/domain/order";
import { InformationStep } from "./information-step";
import { OrderSummary } from "./order-summary";
import { PaymentStep } from "./payment-step";
import { ShippingStep } from "./shipping-step";
import { emptyAddress, steps, type Quote } from "./shared";

export function CheckoutFlow() {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [addr, setAddr] = useState<Address>(emptyAddress);
  const [promo, setPromo] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [methodId, setMethodId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [note, setNote] = useState("");
  const [sameBilling, setSameBilling] = useState(true);
  const [billing, setBilling] = useState<Address>(emptyAddress);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // One key per checkout session: retries can never create a second order.
  const idempotencyKey = useRef<string>("");

  const linesKey = JSON.stringify(lines);
  useEffect(() => {
    if (!ready || !lines.length) return;
    let cancelled = false;
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines, promoCode: promo, country: addr.country }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d.ok) return setError(d.error);
        setQuote(d);
        setMethodId((cur) => cur || d.methods[0]?.id || "");
        setPaymentId((cur) => cur || d.payments[0]?.id || "");
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your order summary.");
      });
    return () => {
      cancelled = true;
    };
    // `lines` is tracked through linesKey to avoid refetching on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, linesKey, promo, addr.country]);

  if (!ready) return <p className="py-20 text-center text-grey-500">Loading…</p>;
  if (!lines.length) {
    return (
      <div className="panel border-dashed px-6 py-20 text-center">
        <p className="font-display text-2xl font-bold">Nothing to check out yet</p>
        <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
      </div>
    );
  }

  const method = quote?.methods.find((m) => m.id === methodId);
  const shipping = method ? method.price : null;
  const total = quote ? quote.subtotal - quote.discount + (shipping ?? 0) : 0;
  const setA = (k: keyof Address) => (v: string) => setAddr((a) => ({ ...a, [k]: v }));
  const setB = (k: keyof Address) => (v: string) => setBilling((a) => ({ ...a, [k]: v }));

  function goTo(n: number) {
    setError("");
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function place(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Created on first submit (not during render) and reused on retries.
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          email,
          newsletterOptIn: optIn,
          shippingAddress: addr,
          billingAddress: sameBilling ? undefined : billing,
          shippingMethodId: methodId,
          paymentMethod: paymentId,
          promoCode: promo || undefined,
          note: note || undefined,
          lines,
        }),
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error);
      clear();
      router.push(`/order/confirmation/${d.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
      <div>
        <ol className="mb-8 flex items-center gap-2 text-sm" aria-label="Checkout progress">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className="flex items-center gap-2">
              <span className={`grid h-8 w-8 place-items-center rounded-full border-2 border-grey-900 text-xs font-black ${i < step ? "bg-success" : i === step ? "bg-gold" : "bg-white text-grey-500"}`}>{i < step ? "✓" : i + 1}</span>
              <span className={i === step ? "font-semibold text-grey-900" : "hidden text-grey-500 sm:inline"}>{s}</span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-5 bg-grey-300 sm:w-8" />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <InformationStep email={email} setEmail={setEmail} optIn={optIn} setOptIn={setOptIn} addr={addr} setA={setA} onNext={(e) => { e.preventDefault(); goTo(1); }} />
        )}
        {step === 1 && (
          <ShippingStep quote={quote} methodId={methodId} setMethodId={setMethodId} note={note} setNote={setNote} onBack={() => goTo(0)} onNext={(e) => { e.preventDefault(); goTo(2); }} />
        )}
        {step === 2 && (
          <PaymentStep quote={quote} paymentId={paymentId} setPaymentId={setPaymentId} sameBilling={sameBilling} setSameBilling={setSameBilling} billing={billing} setB={setB} busy={busy} total={total} onBack={() => goTo(1)} onSubmit={place} />
        )}
        <p role="alert" className="mt-4 min-h-5 text-sm text-red-500">{error}</p>
      </div>

      <OrderSummary quote={quote} promo={promo} onApplyPromo={setPromo} shipping={shipping} total={total} />
    </div>
  );
}
