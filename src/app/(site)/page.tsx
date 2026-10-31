import Link from "next/link";
import { Benefits } from "@/components/home/benefits";
import { Hero } from "@/components/home/hero";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { TeamSection } from "@/components/home/team-section";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding } from "@/repositories/content";
import { container } from "@/services/container";

// Content is edited in the admin, so render on each request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [all, team, content] = await Promise.all([container.products.list(), container.team.list(), getLanding()]);
  const featured = all.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <>
      <Hero content={content} />
      <section className="py-16 sm:py-24">
        <div className="container-bk">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Featured" title={content.featuredTitle} intro={content.featuredText} />
            <Link href="/shop" className="btn btn-ghost self-start sm:self-auto">View all products →</Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <Benefits />
      <TeamSection team={team} title={content.teamTitle} text={content.teamText} />
      <NewsletterCta title={content.newsletterTitle} text={content.newsletterText} />
    </>
  );
}
