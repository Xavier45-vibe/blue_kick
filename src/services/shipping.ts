/**
 * Shipping method strategies (Open/Closed): add a class + register it.
 * Rates and zones come from admin settings, not from code.
 */
import type { ShippingContext, ShippingMethod } from "./ports";

export interface ShippingSettings {
  domesticCountry: string;
  standardCents: number;
  expressCents: number;
  freeThreshold: number;
  internationalSurchargeCents: number;
}

export const defaultShippingSettings: ShippingSettings = {
  domesticCountry: "US",
  standardCents: 595,
  expressCents: 1295,
  freeThreshold: 7500,
  internationalSurchargeCents: 1500,
};

function surcharge(cfg: ShippingSettings, ctx: ShippingContext) {
  const domestic = ctx.address.country.trim().toUpperCase() === cfg.domesticCountry.toUpperCase();
  return domestic ? 0 : cfg.internationalSurchargeCents;
}

export class StandardShipping implements ShippingMethod {
  readonly id = "standard";
  readonly name = "Standard";
  readonly businessDays: [number, number] = [3, 5];
  constructor(private readonly cfg: ShippingSettings) {}
  isAvailable() {
    return true;
  }
  price(ctx: ShippingContext) {
    const extra = surcharge(this.cfg, ctx);
    if (extra === 0 && ctx.subtotal >= this.cfg.freeThreshold) return 0;
    return this.cfg.standardCents + extra;
  }
}

export class ExpressShipping implements ShippingMethod {
  readonly id = "express";
  readonly name = "Express";
  readonly businessDays: [number, number] = [1, 2];
  constructor(private readonly cfg: ShippingSettings) {}
  isAvailable() {
    return true;
  }
  price(ctx: ShippingContext) {
    return this.cfg.expressCents + Math.floor(ctx.weightGrams / 1000) * 200 + surcharge(this.cfg, ctx);
  }
}

export function buildShippingMethods(cfg: ShippingSettings): ShippingMethod[] {
  return [new StandardShipping(cfg), new ExpressShipping(cfg)];
}

export function availableShipping(ctx: ShippingContext, methods: ShippingMethod[]) {
  return methods.filter((m) => m.isAvailable(ctx));
}

export function estimateDelivery(method: ShippingMethod, from = new Date()): string {
  const d = new Date(from);
  let remaining = method.businessDays[1];
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) remaining--;
  }
  return d.toISOString();
}
