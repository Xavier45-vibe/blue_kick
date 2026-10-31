import { PaymentsForm } from "@/components/admin/settings-forms";
import { requireAdmin } from "@/lib/session";
import { getSetting } from "@/repositories/settings";

export const metadata = { title: "Payment settings" };

export default async function PaymentsPage() {
  await requireAdmin(["SUPER_ADMIN"]);
  return <PaymentsForm initial={await getSetting("payments")} paystackConfigured={Boolean(process.env.PAYSTACK_SECRET_KEY)} />;
}
