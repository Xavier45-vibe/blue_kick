import { container } from "@/services/container";
import { availableShipping, estimateDelivery } from "@/services/shipping";
import { CheckoutError } from "@/services/checkout-service";

/** Prices a cart: totals, promo discount and available shipping options. */
export async function POST(request: Request) {
  try {
    const b = await request.json();
    const priced = await container.checkout.priceCart(b.lines ?? [], b.promoCode);
    const ctx = { address: { country: String(b.country ?? "US") }, subtotal: priced.subtotal, weightGrams: priced.weight };
    const [allMethods, providers] = await Promise.all([container.shippingMethods(), container.paymentProviders()]);
    const methods = availableShipping(ctx, allMethods).map((m) => ({
      id: m.id,
      name: m.name,
      days: m.businessDays,
      price: m.price(ctx),
      estimatedDelivery: estimateDelivery(m),
    }));
    return Response.json({
      ok: true,
      subtotal: priced.subtotal,
      discount: priced.discount,
      promoValid: priced.promoValid,
      methods,
      payments: providers.map((p) => ({ id: p.id, label: p.label })),
    });
  } catch (e) {
    const msg = e instanceof CheckoutError ? e.message : "Could not price your cart.";
    return Response.json({ ok: false, error: msg }, { status: 400 });
  }
}
