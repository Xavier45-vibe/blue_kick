"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { toInt } from "@/lib/slug";
import { requireAdmin } from "@/lib/session";
import { defaultLanding, saveLanding, type LandingContent } from "@/repositories/content";
import { saveSetting, type GeneralSettings } from "@/repositories/settings";

const rev = () => {
  revalidatePath("/");
  revalidatePath("/about");
};

export async function saveLandingContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const data = { ...defaultLanding } as LandingContent;
  for (const key of Object.keys(defaultLanding) as (keyof LandingContent)[]) {
    const v = String(formData.get(key) ?? "").trim();
    if (!v) return fail("All fields are required.");
    data[key] = v.slice(0, 400);
  }
  await saveLanding(data);
  rev();
  return done("Landing page published.");
}

export async function saveTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  if (!name || !role || !bio) return fail("Name, role and bio are required.");
  const data = { name, role, bio, position: toInt(formData.get("position")), photoUrl: String(formData.get("photoUrl") ?? "") || null };
  if (id) await db.teamMember.update({ where: { id }, data });
  else await db.teamMember.create({ data });
  revalidatePath("/admin/content/team");
  rev();
  return done("Team member saved.");
}

export async function deleteTeamMember(id: string): Promise<ActionState> {
  await requireAdmin();
  await db.teamMember.delete({ where: { id } });
  revalidatePath("/admin/content/team");
  rev();
  return done("Team member removed.");
}

export async function removeSubscriber(id: string): Promise<ActionState> {
  await requireAdmin();
  await db.subscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
  return done("Subscriber removed.");
}

export async function saveGeneralSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(["SUPER_ADMIN"]);
  const data: GeneralSettings = {
    storeName: String(formData.get("storeName") ?? "").trim(),
    contactEmail: String(formData.get("contactEmail") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    instagram: String(formData.get("instagram") ?? "").trim(),
    facebook: String(formData.get("facebook") ?? "").trim(),
    logoUrl: String(formData.get("logoUrl") ?? "").trim(),
  };
  if (!data.storeName) return fail("Store name is required.");
  if (!/^\S+@\S+\.\S+$/.test(data.contactEmail)) return fail("Enter a valid contact email.");
  await saveSetting("general", data);
  return done("General settings saved.");
}

export async function saveShippingSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(["SUPER_ADMIN"]);
  const cents = (k: string) => Math.round((Number(formData.get(k)) || 0) * 100);
  const country = String(formData.get("domesticCountry") ?? "").trim().toUpperCase();
  if (!country) return fail("Enter the domestic country code.");
  await saveSetting("shipping", {
    domesticCountry: country,
    standardCents: cents("standard"),
    expressCents: cents("express"),
    freeThreshold: cents("freeThreshold"),
    internationalSurchargeCents: cents("international"),
  });
  return done("Shipping rates saved. They apply to new checkouts immediately.");
}

export async function savePaymentSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(["SUPER_ADMIN"]);
  const paystackEnabled = formData.get("paystackEnabled") === "on";
  const paypalEnabled = formData.get("paypalEnabled") === "on";
  if (!paystackEnabled && !paypalEnabled) return fail("Keep at least one payment method enabled.");
  await saveSetting("payments", { paystackEnabled, paypalEnabled });
  return done("Payment methods saved.");
}
