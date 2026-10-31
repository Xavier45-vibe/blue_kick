"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setState("done");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="card-pop bg-gold p-8 text-center">
        <p className="font-display text-2xl font-bold">Thank you!</p>
        <p className="mt-2 text-grey-600">Your message is on its way to the family. We reply within one business day.</p>
        <button type="button" className="btn btn-ghost mt-5" onClick={() => setState("idle")}>Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Name</label>
          <input id="c-name" className="field" autoComplete="name" value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email</label>
          <input id="c-email" type="email" className="field" autoComplete="email" value={form.email} onChange={set("email")} required />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="label">Message</label>
        <textarea id="c-msg" rows={6} className="field" value={form.message} onChange={set("message")} required />
      </div>
      <p role="alert" className="min-h-5 text-sm font-semibold text-error">{state === "error" ? error : ""}</p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
