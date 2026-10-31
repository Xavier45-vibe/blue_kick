import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductCard } from "@/components/product/product-card";
import { Art } from "@/components/ui/art";
import { discountPercent, formatMoney } from "@/lib/money";
import { container } from "@/services/container";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await container.products.findBySlug(slug);
  if (!p) return { title: "Product not found" };
  return { title: p.seoTitle ?? p.name, description: p.seoDescription ?? p.shortDescription };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await container.products.findBySlug(slug);
  if (!product) notFound();

  const [all, categories] = await Promise.all([container.products.list(), container.categories.list()]);
  const category = categories.find((c) => c.id === product.categoryId);
  const related = all.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const soldOut = product.inventory.quantity <= 0 && !product.inventory.allowBackorder;
  const low = !soldOut && product.inventory.quantity <= product.inventory.lowStockThreshold;
  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="container-bk py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-grey-500">
        <Link href="/shop" className="hover:text-grey-900">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-grey-800">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="panel overflow-hidden" style={{ boxShadow: "10px 10px 0 0 #111827" }}>
            <Art tone={product.tone} src={product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || null} label={product.images[0]?.altText ?? product.name} className="aspect-square" />
          </div>
          {product.images.length > 1 && (
            <ul className="mt-6 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img) => (
                <li key={img.id} className="panel overflow-hidden">
                  <Art tone={product.tone} src={img.url || null} label={img.altText} className="aspect-square" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {category && <p className="sticker sticker-violet -rotate-2">{category.name}</p>}
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-black text-grey-900">{formatMoney(product.price)}</span>
            {product.compareAtPrice && <span className="text-lg text-grey-400 line-through">{formatMoney(product.compareAtPrice)}</span>}
            {off > 0 && <span className="sticker sticker-gold rotate-2">Save {off}%</span>}
          </div>
          <p className="mt-5 leading-relaxed text-grey-600">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="label">Available options</p>
              <ul className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <li key={v.id} className="rounded-full border-2 border-grey-900 bg-white px-4 py-2 text-sm font-bold">{v.name} · {formatMoney(v.price)}</li>
                ))}
              </ul>
            </div>
          )}

          <p className={`mt-6 text-sm font-medium ${soldOut ? "text-red-500" : low ? "text-amber-600" : "text-emerald-600"}`}>
            {soldOut ? "Currently out of stock" : low ? `Only ${product.inventory.quantity} left` : "In stock, ships within 48 hours"}
          </p>

          <div className="mt-5">
            <AddToCart productId={product.id} disabled={soldOut} max={Math.max(1, product.inventory.quantity)} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-grey-200 pt-6 text-sm">
            <div><dt className="text-grey-500">SKU</dt><dd className="font-medium">{product.sku}</dd></div>
            {product.weight && <div><dt className="text-grey-500">Weight</dt><dd className="font-medium">{product.weight} g</dd></div>}
          </dl>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((t) => <li key={t} className="sticker">#{t}</li>)}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24" aria-labelledby="related">
          <h2 id="related" className="text-2xl font-bold sm:text-3xl">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
