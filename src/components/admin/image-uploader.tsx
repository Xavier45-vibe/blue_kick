"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/actions/upload";
import { useToast } from "./toast";

export interface ImageItem {
  url: string;
  alt: string;
}

/** Drag-and-drop, multi-file uploader with a primary image selector. Emits hidden inputs for the parent form. */
export function ImageUploader({ initial, initialPrimary }: { initial: ImageItem[]; initialPrimary: number }) {
  const { notify } = useToast();
  const [items, setItems] = useState<ImageItem[]>(initial);
  const [primary, setPrimary] = useState(initialPrimary);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    setBusy(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadImage(fd);
      if (res.ok && res.url) setItems((cur) => [...cur, { url: res.url!, alt: file.name.replace(/\.[^.]+$/, "") }]);
      else notify("error", res.message ?? "Upload failed.");
    }
    setBusy(false);
  }

  function remove(i: number) {
    setItems((cur) => cur.filter((_, x) => x !== i));
    setPrimary((p) => (i === p ? 0 : i < p ? p - 1 : p));
  }

  return (
    <div>
      <p className="label">Images</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) void upload(e.dataTransfer.files); }}
        className={`rounded-xl border-2 border-dashed border-grey-900 p-5 text-center transition ${over ? "bg-violet" : "bg-grey-50"}`}
      >
        <p className="text-sm font-semibold">{busy ? "Uploading…" : "Drag images here, or"}</p>
        <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => input.current?.click()} disabled={busy}>Choose files</button>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) void upload(e.target.files); e.target.value = ""; }} />
        <p className="mt-2 text-xs text-grey-500">JPG, PNG, WebP up to 5 MB each</p>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {items.map((it, i) => (
          <li key={it.url + i} className={`rounded-xl border-2 border-grey-900 p-2 ${i === primary ? "bg-gold" : "bg-white"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.url} alt={it.alt} className="aspect-square w-full rounded-lg object-cover" />
            <input type="hidden" name="imageUrl" value={it.url} />
            <input
              name="imageAlt"
              value={it.alt}
              onChange={(e) => setItems((cur) => cur.map((x, idx) => (idx === i ? { ...x, alt: e.target.value } : x)))}
              aria-label="Alt text"
              placeholder="Alt text"
              className="field mt-2 !min-h-9 !rounded-lg !py-1 text-xs"
            />
            <div className="mt-2 flex items-center justify-between gap-1">
              <label className="flex items-center gap-1 text-xs font-bold">
                <input type="radio" name="primaryImageRadio" checked={i === primary} onChange={() => setPrimary(i)} className="accent-violet" /> Primary
              </label>
              <button type="button" onClick={() => remove(i)} className="text-xs font-bold text-error underline">Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <input type="hidden" name="primaryImage" value={primary} />
    </div>
  );
}
