"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteTeamMember, saveTeamMember } from "@/app/admin/actions/content";
import { uploadImage } from "@/app/admin/actions/upload";
import { ConfirmDialog } from "./confirm";
import { useToast } from "./toast";
import { useToastAction } from "./use-action";

export interface TeamRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  position: number;
  photoUrl: string;
  tone: [string, string];
}

const blank: TeamRow = { id: "", name: "", role: "", bio: "", position: 0, photoUrl: "", tone: ["#C084FC", "#F472B6"] };

export function TeamManager({ rows }: { rows: TeamRow[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<TeamRow>(blank);
  const [photo, setPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [target, setTarget] = useState<TeamRow | null>(null);
  const [pending, start] = useTransition();

  const { formAction, pending: saving } = useToastAction(async (prev, fd) => {
    const r = await saveTeamMember(prev, fd);
    if (r.ok) {
      dialog.current?.close();
      router.refresh();
    }
    return r;
  });

  function openFor(row: TeamRow) {
    setEditing(row);
    setPhoto(row.photoUrl);
    dialog.current?.showModal();
  }

  async function onPhoto(file?: File) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (res.ok && res.url) setPhoto(res.url);
    else notify("error", res.message ?? "Upload failed.");
  }

  return (
    <>
      <div className="mb-5 flex justify-end"><button type="button" className="btn btn-primary" onClick={() => openFor({ ...blank, position: rows.length + 1 })}>+ Add Team Member</button></div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {rows.length === 0 && <li className="panel col-span-full p-10 text-center text-grey-500">No team members yet.</li>}
        {rows.map((m) => (
          <li key={m.id} className="card-pop overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="aspect-square w-full border-b-2 border-grey-900 object-cover" /> : <div className="aspect-square border-b-2 border-grey-900" style={{ background: `linear-gradient(135deg, ${m.tone[0]}, ${m.tone[1]})` }} role="img" aria-label={`Placeholder for ${m.name}`} />}
            <div className="p-4">
              <p className="font-black">{m.name}</p>
              <p className="sticker sticker-violet mt-1">{m.role}</p>
              <p className="mt-2 line-clamp-3 text-sm text-grey-600">{m.bio}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm flex-1" onClick={() => openFor(m)}>Edit</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setTarget(m)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dialog ref={dialog} className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border-2 border-grey-900 bg-white p-0 backdrop:bg-grey-900/60">
        <form key={editing.id || "new"} action={formAction} className="space-y-4 p-6">
          <h2 className="text-xl font-black">{editing.id ? "Edit team member" : "Add team member"}</h2>
          <input type="hidden" name="id" value={editing.id} />
          <input type="hidden" name="photoUrl" value={photo} />
          <div>
            <p className="label">Photo</p>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {photo ? <img src={photo} alt="" className="h-16 w-16 rounded-full border-2 border-grey-900 object-cover" /> : <span className="h-16 w-16 rounded-full border-2 border-dashed border-grey-900" aria-hidden="true" />}
              <input type="file" accept="image/*" aria-label="Upload photo" onChange={(e) => void onPhoto(e.target.files?.[0])} className="text-sm" />
              {uploading && <span className="text-xs font-bold">Uploading…</span>}
            </div>
          </div>
          <div><label htmlFor="tname" className="label">Name</label><input id="tname" name="name" className="field" required defaultValue={editing.name} /></div>
          <div><label htmlFor="trole" className="label">Role / title</label><input id="trole" name="role" className="field" required defaultValue={editing.role} /></div>
          <div><label htmlFor="tbio" className="label">Short bio</label><textarea id="tbio" name="bio" rows={3} className="field" required defaultValue={editing.bio} /></div>
          <div><label htmlFor="tpos" className="label">Display order</label><input id="tpos" name="position" inputMode="numeric" className="field" defaultValue={editing.position} /></div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => dialog.current?.close()}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving || uploading}>{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </dialog>

      <ConfirmDialog
        open={target !== null}
        title={`Remove ${target?.name}?`}
        confirmLabel="Remove"
        busy={pending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && start(async () => { const r = await deleteTeamMember(target.id); notify(r.ok ? "success" : "error", r.message); setTarget(null); router.refresh(); })}
      >
        They will disappear from the landing and About pages.
      </ConfirmDialog>
    </>
  );
}
