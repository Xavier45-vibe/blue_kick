import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Admin", template: "%s | Blue Kick Admin" }, robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell user={{ name: user.name, role: user.role }}>{children}</AdminShell>;
}
