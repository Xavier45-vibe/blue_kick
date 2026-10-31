import { ForgotForm } from "@/components/admin/auth-forms";

export const metadata = { title: "Forgot password", robots: { index: false } };

export default function ForgotPage() {
  return <ForgotForm />;
}
