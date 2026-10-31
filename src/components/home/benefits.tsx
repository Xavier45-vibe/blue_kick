import { SectionHeading } from "@/components/ui/section-heading";

const benefits = [
  { title: "Polished quality", text: "Every item is tested by working artists before it reaches our shelves.", bg: "bg-violet", icon: "M12 3l2.5 5.5L20 9.3l-4 4 1 5.7-5-2.8L7 19l1-5.7-4-4 5.5-.8L12 3Z" },
  { title: "Honest pricing", text: "Competitive prices all year round, with no gimmicks and no hidden fees.", bg: "bg-gold", icon: "M12 2v20M17 6.5C15.5 5 13.5 4.5 12 4.5c-2.5 0-4.5 1.2-4.5 3.2 0 4.6 9 2.3 9 7 0 2-2 3.3-4.5 3.3-2 0-4-.7-5.5-2.2" },
  { title: "Fast dispatch", text: "Orders over $75 ship free and leave our family warehouse within 48 hours.", bg: "bg-pink", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01" },
  { title: "Family-run care", text: "Real people answer your questions. We know the kit because we use it.", bg: "bg-grey-300", icon: "M12 21s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-bk">
        <SectionHeading eyebrow="Why Blue Kick" title="Glamour you can afford" intro="Premium feel, friendly prices and a team that genuinely loves art." align="center" />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <li key={b.title} className={`card-pop p-6 ${i % 2 ? "lg:translate-y-6" : ""}`}>
              <span className={`${b.bg} grid h-14 w-14 place-items-center rounded-2xl border-2 border-grey-900 text-grey-900`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b.icon} /></svg>
              </span>
              <h3 className="mt-5 text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey-600">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
