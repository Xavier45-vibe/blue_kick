"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({ source = "website" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setState("done");
      setMessage(data.created ? "You're in! Check your inbox for a welcome gift." : "You're already on the list. Thank you!");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-lg">
      <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`nl-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field flex-1 !rounded-full !px-5"
        />
        <button type="submit" disabled={state === "loading"} className="btn btn-dark sm:shrink-0">
          {state === "loading" ? "Joining…" : "Join the list"}
        </button>
      </div>
      <p role="status" aria-live="polite" className={`mt-3 min-h-5 text-sm font-semibold ${state === "error" ? "text-error" : "text-grey-900"}`}>
        {message}
      </p>
    </form>
  );
}
