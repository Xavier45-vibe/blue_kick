/**
 * Image storage adapters behind the `ImageStorage` port.
 * Cloudinary when all three CLOUDINARY_* variables are set; otherwise local disk (/public/uploads).
 */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import type { ImageStorage } from "@/services/ports";

export class CloudinaryStorage implements ImageStorage {
  readonly name = "cloudinary";
  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  }
  upload(file: { buffer: Buffer; filename: string; contentType: string }) {
    return new Promise<{ url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "bluekick", resource_type: "image" }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
        resolve({ url: result.secure_url });
      });
      stream.end(file.buffer);
    });
  }
}

export class LocalDiskStorage implements ImageStorage {
  readonly name = "local";
  async upload(file: { buffer: Buffer; filename: string; contentType: string }) {
    if (process.env.VERCEL) {
      throw new Error("Local disk uploads are not supported on Vercel (read-only filesystem). Set the CLOUDINARY_* variables.");
    }
    const ext = (path.extname(file.filename) || ".png").toLowerCase().replace(/[^.a-z0-9]/g, "");
    const name = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), file.buffer);
    return { url: `/uploads/${name}` };
  }
}

export function createImageStorage(): ImageStorage {
  const { CLOUDINARY_CLOUD_NAME: c, CLOUDINARY_API_KEY: k, CLOUDINARY_API_SECRET: s } = process.env;
  if (c && k && s) return new CloudinaryStorage(c, k, s);
  return new LocalDiskStorage();
}
