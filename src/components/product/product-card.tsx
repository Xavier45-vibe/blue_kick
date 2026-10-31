import Link from "next/link";
import type { Product } from "@/domain/product";
import { discountPercent, formatMoney } from "@/lib/money";
import { Art } from "@/components/ui/art";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.inventory.quantity <= 0 && !product.inventory.allowBackorder;
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  return (
    <article className="card-pop group flex flex-col overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="relative block overflow-hidden border-b-2 border-grey-900" aria-label={product.name}>
        <Art tone={product.tone} src={primary?.url || null} label={primary?.altText ?? product.name} className="aspect-[4/5] transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && <span className="sticker sticker-pink -rotate-3">New</span>}
          {off > 0 && <span className="sticker sticker-gold rotate-2">-{off}%</span>}
        </div>
        {soldOut && <span className="absolute inset-x-0 bottom-0 bg-grey-900 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-white">Sold out</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold leading-snug">
          <Link href={`/shop/${product.slug}`} className="hover:text-grey-600">{product.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-grey-500">{product.shortDescription}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-xl font-black text-grey-900">{formatMoney(product.price)}</span>
          {product.compareAtPrice && <span className="text-sm text-grey-400 line-through">{formatMoney(product.compareAtPrice)}</span>}
        </div>
      </div>
    </article>
  );
}
