import { ShippingForm } from "@/components/admin/settings-forms";
import { requireAdmin } from "@/lib/session";
import { getSetting } from "@/repositories/settings";

export const metadata = { title: "Shipping settings" };

export default async function ShippingPage() {
  await requireAdmin(["SUPER_ADMIN"]);
  return <ShippingForm initial={await getSetting("shipping")} />;
}
