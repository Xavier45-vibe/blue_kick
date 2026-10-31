import type { CheckoutRequest } from "@/domain/order";
import { container } from "@/services/container";
import { CheckoutError } from "@/services/checkout-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const order = await container.checkout.placeOrder(body);
    return Response.json({ ok: true, orderId: order.id });
  } catch (e) {
    if (e instanceof CheckoutError) return Response.json({ ok: false, error: e.message }, { status: 400 });
    return Response.json({ ok: false, error: "Something went wrong placing your order." }, { status: 500 });
  }
}
