"use client";

import { useState } from "react";
import { saveGeneralSettings } from "@/app/admin/actions/content";
import { uploadImage } from "@/app/admin/actions/upload";
import type { GeneralSettings } from "@/repositories/settings";
import { useToast } from "./toast";
import { useToastAction } from "./use-action";

export function SaveButton({ pending }: { pending: boolean }) {
  return <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>;
}

export function GeneralForm({ initial }: { initial: GeneralSettings }) {
  const { formAction, pending } = useToastAction(saveGeneralSettings);
  const { notify } = useToast();
  const [logo, setLogo] = useState(initial.logoUrl);
  const [brandColor, setBrandColor] = useState(initial.brandColor);

  async function onLogo(file?: File) {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadImage(fd);
    if (r.ok && r.url) setLogo(r.url);
    else notify("error", r.message ?? "Upload failed.");
  }

  return (
    <form action={formAction} className="panel max-w-2xl space-y-5 p-6">
      <input type="hidden" name="logoUrl" value={logo} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="storeName" className="label">Brand name</label><input id="storeName" name="storeName" className="field" required defaultValue={initial.storeName} /></div>
        <div><label htmlFor="contactEmail" className="label">Contact email</label><input id="contactEmail" name="contactEmail" type="email" className="field" required defaultValue={initial.contactEmail} /></div>
      </div>
      <div>
        <label htmlFor="brandColor" className="label">Website brand color</label>
        <div className="flex items-center gap-3">
          <input
            id="brandColor"
            name="brandColor"
            type="color"
            value={brandColor}
            onChange={(event) => setBrandColor(event.currentTarget.value)}
            className="h-12 w-16 cursor-pointer rounded-lg border-2 border-grey-900 bg-white p-1"
          />
          <span className="font-mono text-sm uppercase text-grey-600">{brandColor}</span>
        </div>
        <p className="mt-1 text-sm text-grey-500">Used for accent buttons, highlights and links across the storefront.</p>
      </div>
      <div><label htmlFor="address" className="label">Address</label><textarea id="address" name="address" rows={2} className="field" defaultValue={initial.address} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="instagram" className="label">Instagram URL</label><input id="instagram" name="instagram" className="field" defaultValue={initial.instagram} /></div>
        <div><label htmlFor="facebook" className="label">Facebook URL</label><input id="facebook" name="facebook" className="field" defaultValue={initial.facebook} /></div>
      </div>
      <div>
        <p className="label">Logo</p>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo ? <img src={logo} alt="Logo" className="h-14 w-14 rounded-lg border-2 border-grey-900 object-contain" /> : <span className="h-14 w-14 rounded-lg border-2 border-dashed border-grey-900" aria-hidden="true" />}
          <input type="file" accept="image/*" aria-label="Upload logo" className="text-sm" onChange={(e) => void onLogo(e.target.files?.[0])} />
        </div>
      </div>
      <SaveButton pending={pending} />
    </form>
  );
}
