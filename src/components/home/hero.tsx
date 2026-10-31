import Link from "next/link";
import { Art } from "@/components/ui/art";
import type { LandingContent } from "@/repositories/content";

/** Splits the title so the last word gets the gold highlighter treatment. */
function Title({ text }: { text: string }) {
  const words = text.trim().split(" ");
  const last = words.pop() ?? "";
  return (
    <>
      {words.join(" ")} <span className="mark-gold">{last}</span>
    </>
  );
}

export function Hero({ content }: { content: LandingContent }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-grey-900 bg-grey-200">
      <div className="container-bk relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div className="rise">
          <p className="sticker sticker-violet -rotate-2">{content.heroEyebrow}</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.98] sm:text-7xl lg:text-[5.5rem]">
            <Title text={content.heroTitle} />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-grey-700 sm:text-lg">{content.heroText}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className="btn btn-primary">Shop the collection →</Link>
            <Link href="/about" className="btn btn-ghost">Meet our family</Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-3">
            {[["15+", "Products"], ["4.9★", "Rated"], ["48h", "Dispatch"]].map(([v, l], i) => (
              <div key={l} className={`panel p-3 text-center ${i === 1 ? "bg-gold" : i === 2 ? "bg-pink" : "bg-white"}`}>
                <dt className="font-display text-2xl font-black text-grey-900">{v}</dt>
                <dd className="text-[11px] font-bold uppercase tracking-wider text-grey-700">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rise-2 relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
          <div className="float panel relative overflow-hidden shadow-pop-lg [--r:2deg]" style={{ boxShadow: "10px 10px 0 0 #111827" }}>
            <Art tone={["#C084FC", "#F472B6"]} label="" className="aspect-[4/5]" />
          </div>
          <div className="float panel absolute -bottom-6 -left-4 h-28 w-28 overflow-hidden shadow-pop [--r:-6deg] sm:-left-8 sm:h-36 sm:w-36" style={{ animationDelay: "1s" }}>
            <Art tone={["#FBBF24", "#F472B6"]} label="" className="h-full w-full" />
          </div>
          <span className="spin-slow absolute -right-3 -top-5 grid h-24 w-24 place-items-center rounded-full border-2 border-grey-900 bg-gold text-center text-[11px] font-black uppercase leading-tight text-grey-900 sm:h-28 sm:w-28">
            Free ship<br />over $75
          </span>
        </div>
      </div>
    </section>
  );
}
