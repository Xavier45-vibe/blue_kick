import type { PromoRule } from "./ports";

export class PercentPromo implements PromoRule {
  constructor(readonly code: string, private readonly percent: number) {}
  discount(subtotal: number) {
    return Math.round((subtotal * this.percent) / 100);
  }
}

export class FlatPromo implements PromoRule {
  constructor(readonly code: string, private readonly cents: number) {}
  discount(subtotal: number) {
    return Math.min(this.cents, subtotal);
  }
}

export const promoRules: PromoRule[] = [
  new PercentPromo("WELCOME10", 10),
  new PercentPromo("GLAM15", 15),
  new FlatPromo("KICK5", 500),
];

export function findPromo(code: string | undefined, rules: PromoRule[] = promoRules) {
  if (!code) return null;
  return rules.find((r) => r.code === code.trim().toUpperCase()) ?? null;
}
