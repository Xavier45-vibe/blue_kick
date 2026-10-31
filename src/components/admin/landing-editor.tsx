"use client";

import { useState } from "react";
import { saveLandingContent } from "@/app/admin/actions/content";
import type { LandingContent } from "@/repositories/content";
import { useToastAction } from "./use-action";

const sections: { id: string; title: string; fields: { key: keyof LandingContent; label: string; long?: boolean }[] }[] = [
  { id: "hero", title: "Hero", fields: [{ key: "heroEyebrow", label: "Eyebrow" }, { key: "heroTitle", label: "Headline" }, { key: "heroText", label: "Intro text", long: true }] },
  { id: "featured", title: "Featured Products", fields: [{ key: "featuredTitle", label: "Title" }, { key: "featuredText", label: "Intro text", long: true }] },
  { id: "team", title: "About the Team", fields: [{ key: "teamTitle", label: "Title" }, { key: "teamText", label: "Intro text", long: true }] },
  { id: "newsletter", title: "Newsletter CTA", fields: [{ key: "newsletterTitle", label: "Title" }, { key: "newsletterText", label: "Intro text", long: true }] },
];

/** Section list with an Edit action per section and one global "Publish Changes" button. */
export function LandingEditor({ initial }: { initial: LandingContent }) {
  const { formAction, pending } = useToastAction(saveLandingContent);
  const [open, setOpen] = useState<string | null>("hero");

  return (
    <form action={formAction} className="space-y-4">
      {sections.map((s) => (
        <section key={s.id} className="panel">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-lg font-black">{s.title}</h2>
            <button type="button" className="btn btn-ghost btn-sm" aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? null : s.id)}>{open === s.id ? "Close" : "Edit"}</button>
          </div>
          {/* Fields stay mounted (hidden) so every value is submitted on publish. */}
          <div className={`${open === s.id ? "grid" : "hidden"} gap-4 border-t-2 border-grey-900 p-5`}>
            {s.fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="label">{f.label}</label>
                {f.long ? <textarea id={f.key} name={f.key} rows={3} className="field" defaultValue={initial[f.key]} required /> : <input id={f.key} name={f.key} className="field" defaultValue={initial[f.key]} required />}
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky bottom-4 flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Publishing…" : "Publish Changes"}</button>
      </div>
    </form>
  );
}
