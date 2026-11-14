import { Suspense } from "react";
import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-context";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Ticker } from "@/components/layout/ticker";
import { getSetting } from "@/repositories/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { storeName } = await getSetting("general");
  return {
    title: {
      absolute: `${storeName} | Art Supplies with Glamour`,
      template: `%s | ${storeName}`,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { storeName, brandColor } = await getSetting("general");
  const brandStyle: React.CSSProperties & { "--bk-violet": string } = {
    "--bk-violet": brandColor,
  };

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col" style={brandStyle}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Ticker />
        <Suspense fallback={<div className="h-16 border-b-2 border-grey-900 md:h-20" aria-hidden="true" />}>
          <Header storeName={storeName} />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer storeName={storeName} />
      </div>
    </CartProvider>
  );
}
