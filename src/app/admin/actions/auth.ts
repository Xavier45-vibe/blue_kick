"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { getAppUrl } from "@/lib/app-url";
import { db } from "@/lib/db";
import { done, fail, type ActionState } from "@/lib/action-state";
import { container } from "@/services/container";
import { passwordResetHtml } from "@/services/emails";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const from = String(formData.get("from") ?? "/admin");
  const target = from.startsWith("/admin") ? from : "/admin";
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: target,
    });
  } catch (e) {
    if (e instanceof AuthError) return fail("Incorrect email or password.");
    throw e; // the redirect on success is thrown by Auth.js and must propagate
  }
  return done("");
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}

/** Always answers the same way so the form cannot be used to discover which emails have accounts. */
export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const generic = done("If that email belongs to an admin, a reset link is on its way.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return generic;
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return generic;

  const token = randomBytes(32).toString("hex");
  await db.passwordReset.deleteMany({ where: { email } });
  await db.passwordReset.create({ data: { email, tokenHash: sha(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
  const link = `${getAppUrl()}/admin/reset-password?token=${token}`;
  try {
    await container.email.send({ to: email, subject: "Reset your Blue Kick admin password", html: passwordResetHtml(link) });
  } catch (e) {
    console.error("[mail] reset failed:", e);
  }
  return generic;
}

export async function resetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return fail("Use at least 10 characters.");
  if (password !== confirm) return fail("Passwords do not match.");

  const record = await db.passwordReset.findUnique({ where: { tokenHash: sha(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return fail("This reset link is invalid or has expired.");

  await db.$transaction([
    db.user.update({ where: { email: record.email }, data: { passwordHash: await bcrypt.hash(password, 12) } }),
    db.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  redirect("/admin/login?reset=1");
}

export async function createAdminUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { requireAdmin } = await import("@/lib/session");
  await requireAdmin(["SUPER_ADMIN"]);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "SUPER_ADMIN" ? "SUPER_ADMIN" : "STORE_MANAGER";
  if (!/^\S+@\S+\.\S+$/.test(email) || !name) return fail("Name and a valid email are required.");
  if (password.length < 10) return fail("Use at least 10 characters.");
  if (await db.user.findUnique({ where: { email } })) return fail("A user with that email already exists.");
  await db.user.create({ data: { email, name, role, passwordHash: await bcrypt.hash(password, 12) } });
  return done(`${role === "SUPER_ADMIN" ? "Super Admin" : "Store Manager"} account created.`);
}
