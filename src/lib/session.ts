import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AppRole } from "@/auth.config";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

/** Every admin page and server action calls this: the proxy is a first gate, this is the real one. */
export async function requireAdmin(allowed: AppRole[] = ["SUPER_ADMIN", "STORE_MANAGER"]): Promise<AdminUser> {
  const session = await auth();
  const u = session?.user;
  if (!u?.id || !u.role) redirect("/admin/login");
  if (!allowed.includes(u.role)) redirect("/admin?denied=1");
  return { id: u.id, name: u.name ?? "Admin", email: u.email ?? "", role: u.role };
}
