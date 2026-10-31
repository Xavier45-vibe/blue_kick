import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-bk py-24 text-center">
      <p className="mark-gold font-display text-8xl font-black">404</p>
      <h1 className="mt-4 text-4xl font-black">This page wandered off</h1>
      <p className="mt-2 text-grey-500">Let's get you back to something beautiful.</p>
      <Link href="/shop" className="btn btn-primary mt-6">Back to the shop</Link>
    </div>
  );
}
