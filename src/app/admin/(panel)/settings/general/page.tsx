import { GeneralForm } from "@/components/admin/settings-forms";
import { requireAdmin } from "@/lib/session";
import { getSetting } from "@/repositories/settings";

export const metadata = { title: "General settings" };

export default async function GeneralPage() {
  await requireAdmin(["SUPER_ADMIN"]);
  return <GeneralForm initial={await getSetting("general")} />;
}
