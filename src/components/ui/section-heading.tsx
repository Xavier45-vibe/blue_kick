export function SectionHeading({ eyebrow, title, intro, align = "left" }: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="sticker sticker-gold -rotate-2">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-grey-600 sm:text-lg">{intro}</p>}
    </div>
  );
}
