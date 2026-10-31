import Link from "next/link";
import type { FormEvent } from "react";
import type { Address } from "@/domain/order";
import { AddressFields, Input } from "./shared";

interface Props {
  email: string;
  setEmail(v: string): void;
  optIn: boolean;
  setOptIn(v: boolean): void;
  addr: Address;
  setA(k: keyof Address): (v: string) => void;
  onNext(e: FormEvent): void;
}

export function InformationStep({ email, setEmail, optIn, setOptIn, addr, setA, onNext }: Props) {
  return (
    <form onSubmit={onNext} className="space-y-5">
      <h2 className="text-2xl font-bold">Contact & delivery</h2>
      <Input id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-violet" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} /> Email me with news and offers
      </label>
      <AddressFields prefix="s" value={addr} onChange={setA} />
      <Input id="phone" label="Phone" type="tel" value={addr.phone ?? ""} onChange={setA("phone")} required={false} autoComplete="tel" />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href="/cart" className="btn btn-ghost">Back to cart</Link>
        <button type="submit" className="btn btn-primary">Continue to shipping</button>
      </div>
    </form>
  );
}
