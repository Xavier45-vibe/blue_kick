import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { getSetting } from "@/repositories/settings";
import { container } from "@/services/container";

export const metadata: Metadata = { title: "Cart" };

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const [list, shipping] = await Promise.all([container.products.list(), getSetting("shipping")]);
  const products = list.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    stock: Math.max(1, p.inventory.quantity),
    tone: p.tone,
  }));
  return (
    <div className="container-bk py-10 sm:py-14">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Your cart</h1>
      <CartView products={products} freeThreshold={shipping.freeThreshold} />
    </div>
  );
}
