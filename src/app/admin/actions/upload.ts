"use server";

import { requireAdmin } from "@/lib/session";
import { container } from "@/services/container";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024;

/** Upload a single image through the configured storage (Cloudinary, or local disk as fallback). */
export async function uploadImage(formData: FormData): Promise<{ ok: boolean; url?: string; message?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "No file selected." };
  if (!ALLOWED.includes(file.type)) return { ok: false, message: "Use a JPG, PNG, WebP, GIF or AVIF image." };
  if (file.size > MAX_BYTES) return { ok: false, message: "Image must be under 5 MB." };
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await container.images.upload({ buffer, filename: file.name, contentType: file.type });
    return { ok: true, url };
  } catch (e) {
    console.error("[upload]", e);
    return { ok: false, message: "Upload failed. Check your Cloudinary settings." };
  }
}
