import type { TeamMember } from "@/domain/product";
import { Art } from "@/components/ui/art";
import { SectionHeading } from "@/components/ui/section-heading";

type Member = TeamMember & { photoUrl?: string };
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function TeamSection({ team, title = "A family that loves art", text = "Blue Kick began around a kitchen table. Today the whole family still packs, picks and answers your emails." }: { team: Member[]; title?: string; text?: string }) {
  return (
    <section className="border-y-2 border-grey-900 bg-grey-900 py-16 sm:py-24">
      <div className="container-bk">
        <div className="[&_h2]:!text-white [&_p:not(.sticker)]:!text-grey-300">
          <SectionHeading eyebrow="About the team" title={title} intro={text} />
        </div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <li key={m.id} className={`card-pop overflow-hidden ${tilts[i % tilts.length]} hover:rotate-0`}>
              <Art tone={m.tone} src={m.photoUrl ?? null} label={`Portrait of ${m.name}`} className="aspect-square border-b-2 border-grey-900" />
              <div className="p-5">
                <h3 className="text-lg font-bold">{m.name}</h3>
                <p className="sticker sticker-violet mt-1">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-grey-600">{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
