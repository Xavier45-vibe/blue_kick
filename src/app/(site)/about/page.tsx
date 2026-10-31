import type { Metadata } from "next";
import Link from "next/link";
import { TeamSection } from "@/components/home/team-section";
import { Art } from "@/components/ui/art";
import { SectionHeading } from "@/components/ui/section-heading";
import { container } from "@/services/container";

export const metadata: Metadata = {
  title: "About",
  description: "The story of Blue Kick, a family-owned art supplies store built on quality, colour and care.",
};

const values = [
  { title: "Family first", text: "We treat every customer like someone who has pulled up a chair at our table." },
  { title: "Quality you can feel", text: "If we would not use it in our own studio, we do not sell it." },
  { title: "Joyful glamour", text: "Art should feel special and lively, never stuffy or out of reach." },
];

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const team = await container.team.list();
  return (
    <>
      <section className="border-b-2 border-grey-900 bg-grey-200">
        <div className="container-bk grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Our story" title="From a kitchen table to your creative studio" />
            <div className="mt-6 space-y-4 leading-relaxed text-grey-600">
              <p>Blue Kick started when Amara could not find art supplies that felt as special as the work she wanted to make, at a price that made sense. So she began sourcing them herself.</p>
              <p>Soon her brother, her mum and a few friends were packing parcels after dinner. Today we are still a family business, still hand-picking every brush, pigment and pad.</p>
              <p>We cater to a new generation of makers who want their tools to look as good as they perform.</p>
            </div>
            <Link href="/shop" className="btn btn-primary mt-8">Explore the shop</Link>
          </div>
          <div className="panel overflow-hidden" style={{ boxShadow: "10px 10px 0 0 #111827" }}>
            <Art tone={["#C084FC", "#F472B6"]} label="Blue Kick family studio illustration" className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-bk">
          <SectionHeading eyebrow="Values" title="What we stand for" align="center" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title} className="card-pop p-7">
                <span className={`sticker ${["sticker-violet", "sticker-gold", "sticker-pink"][i % 3]} !text-base`}>0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-500">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TeamSection team={team} />
    </>
  );
}
