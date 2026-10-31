"use client";

import { createAdminUser } from "@/app/admin/actions/auth";
import { savePaymentSettings, saveShippingSettings } from "@/app/admin/actions/content";
import type { PaymentSettings } from "@/repositories/settings";
import type { ShippingSettings } from "@/services/shipping";
import { SaveButton } from "./settings-store";
import { useToastAction } from "./use-action";

export { GeneralForm } from "./settings-store";

export function ShippingForm({ initial }: { initial: ShippingSettings }) {
  const { formAction, pending } = useToastAction(saveShippingSettings);
  const d = (c: number) => (c / 100).toFixed(2);
  return (
    <form action={formAction} className="panel max-w-2xl space-y-5 p-6">
      <p className="text-sm text-grey-600">Rates apply to new checkouts immediately. Amounts are in dollars.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="domesticCountry" className="label">Home country (code)</label><input id="domesticCountry" name="domesticCountry" className="field uppercase" required defaultValue={initial.domesticCountry} /></div>
        <div><label htmlFor="freeThreshold" className="label">Free standard shipping from ($)</label><input id="freeThreshold" name="freeThreshold" inputMode="decimal" className="field" defaultValue={d(initial.freeThreshold)} /></div>
        <div><label htmlFor="standard" className="label">Standard rate ($)</label><input id="standard" name="standard" inputMode="decimal" className="field" defaultValue={d(initial.standardCents)} /></div>
        <div><label htmlFor="express" className="label">Express rate ($)</label><input id="express" name="express" inputMode="decimal" className="field" defaultValue={d(initial.expressCents)} /></div>
        <div><label htmlFor="international" className="label">International surcharge ($)</label><input id="international" name="international" inputMode="decimal" className="field" defaultValue={d(initial.internationalSurchargeCents)} /></div>
      </div>
      <SaveButton pending={pending} />
    </form>
  );
}

export function PaymentsForm({ initial, paystackConfigured }: { initial: PaymentSettings; paystackConfigured: boolean }) {
  const { formAction, pending } = useToastAction(savePaymentSettings);
  return (
    <form action={formAction} className="panel max-w-2xl space-y-5 p-6">
      <label className="flex min-h-11 items-center gap-3 font-semibold"><input type="checkbox" name="paystackEnabled" defaultChecked={initial.paystackEnabled} className="h-5 w-5 accent-violet" /> Card payments via Paystack</label>
      <label className="flex min-h-11 items-center gap-3 font-semibold"><input type="checkbox" name="paypalEnabled" defaultChecked={initial.paypalEnabled} className="h-5 w-5 accent-violet" /> PayPal</label>
      <div className={`rounded-xl border-2 border-grey-900 p-4 text-sm ${paystackConfigured ? "bg-success" : "bg-gold"}`}>
        {paystackConfigured ? "PAYSTACK_SECRET_KEY is set. Live Paystack transactions are enabled." : "PAYSTACK_SECRET_KEY is not set. Payments are simulated. Add the key to your .env file to go live."}
      </div>
      <p className="text-xs text-grey-500">API keys are never stored in the database. Set them in environment variables.</p>
      <SaveButton pending={pending} />
    </form>
  );
}

export function UserForm() {
  const { formAction, pending } = useToastAction(createAdminUser);
  return (
    <form action={formAction} className="panel h-fit max-w-md space-y-4 p-6">
      <h2 className="text-lg font-black">Add an admin user</h2>
      <div><label htmlFor="uname" className="label">Name</label><input id="uname" name="name" className="field" required /></div>
      <div><label htmlFor="uemail" className="label">Email</label><input id="uemail" name="email" type="email" className="field" required /></div>
      <div><label htmlFor="upass" className="label">Temporary password</label><input id="upass" name="password" type="password" minLength={10} className="field" required /></div>
      <div><label htmlFor="urole" className="label">Role</label><select id="urole" name="role" className="field"><option value="STORE_MANAGER">Store Manager</option><option value="SUPER_ADMIN">Super Admin</option></select></div>
      <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Creating…" : "Create user"}</button>
    </form>
  );
}
