/** Transactional email templates + the Mailer implementation (depends on the EmailSender port). */
import type { Order } from "@/domain/order";
import { formatMoney } from "@/lib/money";
import type { EmailSender, Mailer } from "./ports";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function shell(title: string, body: string) {
  return `<div style="font-family:Inter,Arial,sans-serif;background:#F3F4F6;padding:24px">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
    <div style="background:#111827;color:#fff;padding:20px 28px;font-size:20px;font-weight:700">Blue <span style="color:#C084FC">Kick</span></div>
    <div style="padding:28px;color:#374151;line-height:1.6"><h1 style="font-size:22px;color:#111827;margin:0 0 12px">${esc(title)}</h1>${body}</div>
    <div style="padding:16px 28px;background:#F9FAFB;color:#6B7280;font-size:12px">Blue Kick, a family-owned art supplies store.</div>
  </div></div>`;
}

export function orderConfirmationHtml(order: Order, appUrl: string) {
  const rows = order.items.map((i) => `<tr><td style="padding:6px 0">${esc(i.name)} × ${i.quantity}</td><td style="text-align:right">${formatMoney(i.unitPrice * i.quantity)}</td></tr>`).join("");
  return shell(
    `Thank you, ${order.shippingAddress.firstName}!`,
    `<p>Your order <strong>${esc(order.number)}</strong> is confirmed. Estimated delivery: <strong>${new Date(order.estimatedDelivery).toDateString()}</strong>.</p>
     <table style="width:100%;border-collapse:collapse">${rows}
     <tr><td style="padding-top:10px;border-top:1px solid #E5E7EB"><strong>Total</strong></td><td style="text-align:right;border-top:1px solid #E5E7EB"><strong>${formatMoney(order.total)}</strong></td></tr></table>
     <p><a href="${appUrl}/order/confirmation/${order.id}" style="color:#7C3AED">View your order</a></p>`,
  );
}

export function shippedHtml(order: Order, tracking: string) {
  return shell("Your order is on its way", `<p>Order <strong>${esc(order.number)}</strong> has shipped.</p><p>Tracking number: <strong>${esc(tracking)}</strong></p>`);
}

export function welcomeHtml() {
  return shell("Welcome to the Blue Kick family", `<p>Thanks for joining! Use code <strong>WELCOME10</strong> for 10% off your first order.</p>`);
}

export function passwordResetHtml(link: string) {
  return shell("Reset your password", `<p>Use the link below within 1 hour to choose a new password.</p><p><a href="${link}" style="color:#7C3AED">${esc(link)}</a></p><p>If you did not ask for this, you can ignore this email.</p>`);
}

export class OrderMailer implements Mailer {
  constructor(private readonly sender: EmailSender, private readonly appUrl: string) {}
  async sendOrderConfirmation(order: Order) {
    try {
      await this.sender.send({ to: order.email, subject: `Order ${order.number} confirmed`, html: orderConfirmationHtml(order, this.appUrl) });
    } catch (e) {
      // An email failure must never fail a paid order.
      console.error("[mail] order confirmation failed:", e);
    }
  }
}
