import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { SectionHeading } from "@/components/ui/section-heading";
import { container } from "@/services/container";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Blue Kick art supplies: drawing, painting, brushes, paper, calligraphy, kits and accessories.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([container.products.list(), container.categories.list()]);
  return (
    <>
      <section className="border-b-2 border-grey-900 bg-gold">
        <div className="container-bk py-12 sm:py-16">
          <SectionHeading eyebrow="Shop" title="All art supplies" intro="Filter, sort and find the tools that make your work shine." />
        </div>
      </section>
      <div className="container-bk py-10 sm:py-14">
        <ShopBrowser products={products} categories={categories} />
      </div>
    </>
  );
}
