"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/session";
import { container } from "@/services/container";
import { shippedHtml } from "@/services/emails";
import { toOrder, orderInclude } from "@/repositories/mappers";

const FULFILLMENT = ["unfulfilled", "shipped", "delivered", "cancelled"] as const;
const PAYMENT = ["pending", "paid", "failed", "refunded"] as const;

export async function updateOrderStatus(id: string, kind: "fulfillment" | "payment", value: string): Promise<ActionState> {
  const admin = await requireAdmin();
  if (kind === "fulfillment") {
    if (!(FULFILLMENT as readonly string[]).includes(value)) return fail("Invalid status.");
    const current = await db.order.findUnique({ where: { id }, include: { items: true } });
    if (!current) return fail("Order not found.");
    await db.$transaction(async (tx) => {
      await tx.order.update({ where: { id }, data: { fulfillmentStatus: value as (typeof FULFILLMENT)[number] } });
      // Cancelling returns reserved stock to the shelf (only once).
      if (value === "cancelled" && current.fulfillmentStatus !== "cancelled") {
        for (const i of current.items) await tx.product.update({ where: { id: i.productId }, data: { quantity: { increment: i.quantity } } });
      }
      await tx.orderNote.create({ data: { orderId: id, author: admin.name, body: `Fulfillment set to ${value}.` } });
    });
  } else {
    if (!(PAYMENT as readonly string[]).includes(value)) return fail("Invalid status.");
    await db.order.update({ where: { id }, data: { paymentStatus: value as (typeof PAYMENT)[number] } });
    await db.orderNote.create({ data: { orderId: id, author: admin.name, body: `Payment set to ${value}.` } });
  }
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  return done("Status updated.");
}

export async function markShipped(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const tracking = String(formData.get("tracking") ?? "").trim();
  if (!tracking) return fail("Enter a tracking number.");
  const row = await db.order.findUnique({ where: { id }, include: orderInclude });
  if (!row) return fail("Order not found.");
  await db.order.update({ where: { id }, data: { fulfillmentStatus: "shipped", trackingNumber: tracking } });
  await db.orderNote.create({ data: { orderId: id, author: admin.name, body: `Marked as shipped. Tracking: ${tracking}` } });
  try {
    await container.email.send({ to: row.email, subject: `Order ${row.number} has shipped`, html: shippedHtml(toOrder(row), tracking) });
  } catch (e) {
    console.error("[mail] shipped email failed:", e);
  }
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  return done("Marked as shipped and customer emailed.");
}

export async function addOrderNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return fail("Write a note first.");
  await db.orderNote.create({ data: { orderId: id, author: admin.name, body: body.slice(0, 1000) } });
  revalidatePath(`/admin/orders/${id}`);
  return done("Note added.");
}
