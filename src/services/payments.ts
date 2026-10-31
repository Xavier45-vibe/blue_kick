/**
 * Payment providers, each substitutable for `PaymentProvider` (Liskov).
 *
 * Paystack: when PAYSTACK_SECRET_KEY is set, `charge` creates a real transaction
 * record via the Paystack API (initialize). Without a key it runs in simulated
 * mode so the store is usable in development. PayPal is simulated.
 */
import type { PaymentProvider, PaymentRequest, PaymentResult } from "./ports";

class SimulatedProvider implements PaymentProvider {
  constructor(readonly id: string, readonly label: string) {}
  async charge(request: PaymentRequest): Promise<PaymentResult> {
    if (request.amount <= 0) return { success: false, reference: request.reference, message: "Invalid amount" };
    return { success: true, reference: `${this.id.toUpperCase()}-${request.reference}` };
  }
}

export class PaystackProvider implements PaymentProvider {
  readonly id = "paystack";
  readonly label = "Card via Paystack";
  private readonly fallback = new SimulatedProvider("paystack", this.label);

  async charge(request: PaymentRequest): Promise<PaymentResult> {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) return this.fallback.charge(request);
    try {
      const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: request.email, amount: request.amount, reference: `BK-${request.reference}` }),
      });
      const data = (await res.json()) as { status?: boolean; message?: string; data?: { reference?: string } };
      if (!res.ok || !data.status) return { success: false, reference: request.reference, message: data.message ?? "Paystack declined the transaction." };
      return { success: true, reference: data.data?.reference ?? `BK-${request.reference}` };
    } catch {
      return { success: false, reference: request.reference, message: "Could not reach Paystack. Please try again." };
    }
  }
}

export const paymentProviders: PaymentProvider[] = [new PaystackProvider(), new SimulatedProvider("paypal", "PayPal")];
