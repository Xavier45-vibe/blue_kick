import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterCta({ title = "Get 10% off your first order", text = "Join our list for new arrivals, studio tips and subscriber-only offers." }: { title?: string; text?: string }) {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="container-bk">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-grey-900 bg-violet px-6 py-14 text-center sm:px-12 sm:py-20" style={{ boxShadow: "10px 10px 0 0 #111827" }}>
          <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full border-2 border-grey-900 bg-gold" aria-hidden="true" />
          <span className="absolute -bottom-8 -right-4 h-32 w-32 rotate-12 rounded-3xl border-2 border-grey-900 bg-pink" aria-hidden="true" />
          <p className="sticker sticker-dark relative">Newsletter</p>
          <h2 className="relative mx-auto mt-4 max-w-2xl text-4xl font-black sm:text-6xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-grey-800">{text} Use code <strong>WELCOME10</strong> at checkout.</p>
          <div className="relative mt-8 flex justify-center">
            <NewsletterForm source="landing" />
          </div>
        </div>
      </div>
    </section>
  );
}
