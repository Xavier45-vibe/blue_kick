import { Suspense } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Ticker } from "@/components/layout/ticker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Ticker />
        <Suspense fallback={<div className="h-16 border-b-2 border-grey-900 md:h-20" aria-hidden="true" />}>
          <Header />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
