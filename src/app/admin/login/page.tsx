import { LoginForm } from "@/components/admin/auth-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "/admin";
  return <LoginForm from={from} reset={sp.reset === "1"} />;
}
