import type { Address } from "@/domain/order";

export interface Quote {
  subtotal: number;
  discount: number;
  promoValid: boolean;
  methods: { id: string; name: string; days: [number, number]; price: number; estimatedDelivery: string }[];
  payments: { id: string; label: string }[];
}

export const emptyAddress: Address = { firstName: "", lastName: "", line1: "", line2: "", city: "", region: "", postalCode: "", country: "US", phone: "" };
export const steps = ["Information", "Shipping", "Payment"] as const;

export function Input({ id, label, value, onChange, type = "text", required = true, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{!required && " (optional)"}</label>
      <input id={id} type={type} className="field" value={value} required={required} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function AddressFields({ prefix, value, onChange }: { prefix: string; value: Address; onChange: (k: keyof Address) => (v: string) => void }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id={`${prefix}fn`} label="First name" value={value.firstName} onChange={onChange("firstName")} autoComplete="given-name" />
        <Input id={`${prefix}ln`} label="Last name" value={value.lastName} onChange={onChange("lastName")} autoComplete="family-name" />
      </div>
      <Input id={`${prefix}l1`} label="Address" value={value.line1} onChange={onChange("line1")} autoComplete="address-line1" />
      <Input id={`${prefix}l2`} label="Apartment, suite" value={value.line2 ?? ""} onChange={onChange("line2")} required={false} autoComplete="address-line2" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id={`${prefix}city`} label="City" value={value.city} onChange={onChange("city")} autoComplete="address-level2" />
        <Input id={`${prefix}region`} label="State / Region" value={value.region} onChange={onChange("region")} autoComplete="address-level1" />
        <Input id={`${prefix}zip`} label="Postal code" value={value.postalCode} onChange={onChange("postalCode")} autoComplete="postal-code" />
        <Input id={`${prefix}country`} label="Country" value={value.country} onChange={onChange("country")} autoComplete="country" />
      </div>
    </>
  );
}
