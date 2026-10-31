import Link from "next/link";

export const metadata = { title: "About Page" };

export default function AboutContentPage() {
  return (
    <div className="panel max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-black">About page</h2>
      <p className="text-grey-600">The About page tells the company story and shows the team. The team section is managed here:</p>
      <Link href="/admin/content/team" className="btn btn-primary">Edit team members →</Link>
      <p className="text-sm text-grey-500">The story and values text lives in <code className="rounded bg-grey-100 px-1">src/app/(site)/about/page.tsx</code>.</p>
    </div>
  );
}
