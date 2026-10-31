/** Key/value settings stored in the `Setting` table (general, shipping, payments). */
import { db } from "@/lib/db";
import { defaultShippingSettings, type ShippingSettings } from "@/services/shipping";

export interface GeneralSettings {
  storeName: string;
  contactEmail: string;
  address: string;
  instagram: string;
  facebook: string;
  logoUrl: string;
}

export interface PaymentSettings {
  paystackEnabled: boolean;
  paypalEnabled: boolean;
}

export const defaultGeneral: GeneralSettings = {
  storeName: "Blue Kick",
  contactEmail: "hello@bluekick.store",
  address: "",
  instagram: "",
  facebook: "",
  logoUrl: "",
};

export const defaultPayments: PaymentSettings = { paystackEnabled: true, paypalEnabled: true };

type SettingMap = {
  general: GeneralSettings;
  shipping: ShippingSettings;
  payments: PaymentSettings;
};

const defaults: SettingMap = { general: defaultGeneral, shipping: defaultShippingSettings, payments: defaultPayments };

export async function getSetting<K extends keyof SettingMap>(key: K): Promise<SettingMap[K]> {
  const row = await db.setting.findUnique({ where: { key } });
  return { ...defaults[key], ...((row?.value as object | null) ?? {}) } as SettingMap[K];
}

export async function saveSetting<K extends keyof SettingMap>(key: K, value: SettingMap[K]) {
  await db.setting.upsert({ where: { key }, update: { value: value as object }, create: { key, value: value as object } });
}
