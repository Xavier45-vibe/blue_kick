import { container } from "@/services/container";

export async function GET(_req: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params;
  const order = await container.orders.findById(id);
  if (!order) return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
  return Response.json({ ok: true, order });
}
