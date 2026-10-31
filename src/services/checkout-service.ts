/**
 * Orchestrates checkout. Depends only on ports (Dependency Inversion).
 * Idempotent (same key returns same order) and validates stock on placement.
 */
import type { CheckoutRequest, Order, OrderItem } from "@/domain/order";
import { estimateDelivery } from "./shipping";
import { findPromo } from "./promos";
import type {
  Mailer,
  NewsletterStore,
  OrderStore,
  PaymentProvider,
  ProductReader,
  PromoRule,
  ShippingMethod,
  StockWriter,
} from "./ports";

export class CheckoutError extends Error {}

export interface CheckoutDeps {
  products: ProductReader & StockWriter;
  orders: OrderStore;
  newsletter: NewsletterStore;
  mailer: Mailer;
  payments: () => Promise<PaymentProvider[]>;
  /** Resolved per request so admin rate changes apply immediately. */
  shipping: () => Promise<ShippingMethod[]>;
  promos: PromoRule[];
}

export class CheckoutService {
  constructor(private readonly deps: CheckoutDeps) {}

  async priceCart(lines: CheckoutRequest["lines"], promoCode?: string) {
    const items: OrderItem[] = [];
    let weight = 0;
    for (const line of lines) {
      const p = await this.deps.products.findById(line.productId);
      if (!p || p.status !== "active") throw new CheckoutError("An item in your cart is no longer available.");
      if (line.quantity < 1 || !Number.isInteger(line.quantity)) throw new CheckoutError("Invalid quantity.");
      items.push({ productId: p.id, name: p.name, sku: p.sku, unitPrice: p.price, quantity: line.quantity, tone: p.tone });
      weight += (p.weight ?? 0) * line.quantity;
    }
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const promo = findPromo(promoCode, this.deps.promos);
    return { items, subtotal, weight, discount: promo ? promo.discount(subtotal) : 0, promoValid: Boolean(promo) };
  }

  async placeOrder(req: CheckoutRequest): Promise<Order> {
    const existing = await this.deps.orders.findByIdempotencyKey(req.idempotencyKey);
    if (existing) return existing;
    if (!req.lines.length) throw new CheckoutError("Your cart is empty.");
    if (!/^\S+@\S+\.\S+$/.test(req.email)) throw new CheckoutError("A valid email is required.");

    const [methods, providers] = await Promise.all([this.deps.shipping(), this.deps.payments()]);
    const method = methods.find((m) => m.id === req.shippingMethodId);
    const provider = providers.find((p) => p.id === req.paymentMethod);
    if (!method) throw new CheckoutError("Choose a shipping method.");
    if (!provider) throw new CheckoutError("Choose a payment method.");

    const priced = await this.priceCart(req.lines, req.promoCode);
    const ctx = { address: req.shippingAddress, subtotal: priced.subtotal, weightGrams: priced.weight };
    if (!method.isAvailable(ctx)) throw new CheckoutError("That shipping method is unavailable.");
    const shipping = method.price(ctx);
    const total = priced.subtotal - priced.discount + shipping;

    const reserved: { id: string; qty: number }[] = [];
    for (const item of priced.items) {
      if (!(await this.deps.products.reserve(item.productId, item.quantity))) {
        for (const r of reserved) await this.deps.products.release(r.id, r.qty);
        throw new CheckoutError(`Sorry, ${item.name} is out of stock.`);
      }
      reserved.push({ id: item.productId, qty: item.quantity });
    }

    const id = crypto.randomUUID();
    const payment = await provider.charge({ amount: total, email: req.email, reference: id.slice(0, 8) });
    if (!payment.success) {
      for (const r of reserved) await this.deps.products.release(r.id, r.qty);
      throw new CheckoutError(payment.message ?? "Payment failed.");
    }

    const order: Order = {
      id,
      number: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      idempotencyKey: req.idempotencyKey,
      email: req.email,
      shippingAddress: req.shippingAddress,
      billingAddress: req.billingAddress ?? req.shippingAddress,
      items: priced.items,
      subtotal: priced.subtotal,
      discount: priced.discount,
      shipping,
      total,
      shippingMethodId: method.id,
      shippingMethodName: method.name,
      estimatedDelivery: estimateDelivery(method),
      paymentMethod: provider.label,
      paymentReference: payment.reference,
      paymentStatus: "paid",
      fulfillmentStatus: "unfulfilled",
      note: req.note,
      createdAt: new Date().toISOString(),
    };
    await this.deps.orders.save(order);
    if (req.newsletterOptIn) await this.deps.newsletter.add(req.email, "checkout");
    await this.deps.mailer.sendOrderConfirmation(order);
    return order;
  }
}
