/** Editable landing page copy, stored as one JSON row in `ContentBlock`. */
import { db } from "@/lib/db";

export interface LandingContent {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  featuredTitle: string;
  featuredText: string;
  teamTitle: string;
  teamText: string;
  newsletterTitle: string;
  newsletterText: string;
}

export const defaultLanding: LandingContent = {
  heroEyebrow: "Family-owned art supplies",
  heroTitle: "Art supplies with a little glamour.",
  heroText: "Polished quality, honest prices and a splash of colour for every maker.",
  featuredTitle: "Studio favourites",
  featuredText: "The pieces our community reaches for again and again.",
  teamTitle: "A family that loves art",
  teamText: "Blue Kick began around a kitchen table. Today the whole family still packs, picks and answers your emails.",
  newsletterTitle: "Get 10% off your first order",
  newsletterText: "Join our list for new arrivals, studio tips and subscriber-only offers.",
};

export async function getLanding(): Promise<LandingContent> {
  const row = await db.contentBlock.findUnique({ where: { key: "landing" } });
  return { ...defaultLanding, ...((row?.data as Partial<LandingContent> | null) ?? {}) };
}

export async function saveLanding(data: LandingContent) {
  const json = { ...data };
  await db.contentBlock.upsert({ where: { key: "landing" }, update: { data: json }, create: { key: "landing", data: json } });
}
