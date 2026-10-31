import { LandingEditor } from "@/components/admin/landing-editor";
import { getLanding } from "@/repositories/content";

export const metadata = { title: "Landing Page" };

export default async function LandingContentPage() {
  return <LandingEditor initial={await getLanding()} />;
}
