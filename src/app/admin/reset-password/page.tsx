import { ResetForm } from "@/components/admin/auth-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset password", robots: { index: false } };

export default async function ResetPage({ searchParams }: PageProps<"/admin/reset-password">) {
  const sp = await searchParams;
  return <ResetForm token={typeof sp.token === "string" ? sp.token : ""} />;
}
