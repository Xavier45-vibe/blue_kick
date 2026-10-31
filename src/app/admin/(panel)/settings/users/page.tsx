import { UserForm } from "@/components/admin/settings-forms";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Admin users" };

export default async function UsersPage() {
  await requireAdmin(["SUPER_ADMIN"]);
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-bold">{u.name}</td><td>{u.email}</td>
                <td><span className={`sticker ${u.role === "SUPER_ADMIN" ? "sticker-violet" : "sticker-gold"}`}>{u.role === "SUPER_ADMIN" ? "Super Admin" : "Store Manager"}</span></td>
                <td>{u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserForm />
    </div>
  );
}
