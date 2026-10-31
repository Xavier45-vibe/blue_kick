import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-bk py-10 sm:py-14">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
