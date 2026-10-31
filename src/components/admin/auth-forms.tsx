"use client";

import Link from "next/link";
import { login, requestPasswordReset, resetPassword } from "@/app/admin/actions/auth";
import { ToastProvider } from "./toast";
import { useToastAction } from "./use-action";

function Frame({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-grey-200 px-4 py-10">
      <div className="card-pop w-full max-w-md p-7 sm:p-9" style={{ boxShadow: "8px 8px 0 0 #111827" }}>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 -rotate-6 place-items-center rounded-xl border-2 border-grey-900 bg-gold font-display text-xl font-black">B</span>
          <p className="font-display text-xl font-black">Blue<span className="text-violet">Kick</span> <span className="sticker sticker-dark ml-1">Admin</span></p>
        </div>
        <h1 className="mt-6 text-3xl font-black">{title}</h1>
        <p className="mt-1 text-sm text-grey-600">{intro}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function LoginInner({ from, reset }: { from: string; reset: boolean }) {
  const { formAction, pending, state } = useToastAction(login);
  return (
    <Frame title="Welcome back" intro="Sign in to manage products, orders and content.">
      {reset && <p className="mb-4 rounded-xl border-2 border-grey-900 bg-success p-3 text-sm font-bold" role="status">Password updated. Please sign in.</p>}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="from" value={from} />
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" className="field" autoComplete="current-password" required />
        </div>
        {!state.ok && <p role="alert" className="text-sm font-bold text-error">{state.message}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        <Link href="/admin/forgot-password" className="block text-center text-sm font-semibold underline underline-offset-4">Forgot your password?</Link>
      </form>
    </Frame>
  );
}

function ForgotInner() {
  const { formAction, pending, state } = useToastAction(requestPasswordReset);
  return (
    <Frame title="Reset password" intro="Enter your admin email and we will send you a reset link.">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" required />
        </div>
        {state.ok && state.message && <p role="status" className="rounded-xl border-2 border-grey-900 bg-gold p-3 text-sm font-bold">{state.message}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</button>
        <Link href="/admin/login" className="block text-center text-sm font-semibold underline underline-offset-4">Back to sign in</Link>
      </form>
    </Frame>
  );
}

function ResetInner({ token }: { token: string }) {
  const { formAction, pending, state } = useToastAction(resetPassword);
  return (
    <Frame title="Choose a new password" intro="Use at least 10 characters.">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label htmlFor="password" className="label">New password</label>
          <input id="password" name="password" type="password" className="field" autoComplete="new-password" minLength={10} required />
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirm password</label>
          <input id="confirm" name="confirm" type="password" className="field" autoComplete="new-password" minLength={10} required />
        </div>
        {!state.ok && <p role="alert" className="text-sm font-bold text-error">{state.message}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Saving…" : "Update password"}</button>
      </form>
    </Frame>
  );
}

/** Each public auth page owns its toast provider (they render outside the admin shell). */
export const LoginForm = (props: { from: string; reset: boolean }) => <ToastProvider><LoginInner {...props} /></ToastProvider>;
export const ForgotForm = () => <ToastProvider><ForgotInner /></ToastProvider>;
export const ResetForm = (props: { token: string }) => <ToastProvider><ResetInner {...props} /></ToastProvider>;
