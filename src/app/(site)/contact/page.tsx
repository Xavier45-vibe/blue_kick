import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Blue Kick family. Questions, orders, or just art chat.",
};

const faqs = [
  { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days and Express takes 1–2. Orders over $75 ship free on Standard." },
  { q: "Can I return an item?", a: "Yes. Unused items can be returned within 30 days. Contact us and we will sort it out quickly." },
  { q: "Do you offer gift wrapping?", a: "Add a gift message at checkout and we will pack your order in our signature grey box." },
  { q: "Which payment methods are accepted?", a: "Cards via Paystack and PayPal." },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b-2 border-grey-900 bg-pink">
        <div className="container-bk py-12 sm:py-16">
          <SectionHeading eyebrow="Contact" title="Let's talk art" intro="Have a question about a product or an order? We would love to hear from you." />
        </div>
      </section>

      <div className="container-bk grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
          <ContactForm />
        </div>
        <aside>
          <div className="card-pop !bg-grey-900 p-7 text-grey-300">
            <h2 className="text-xl font-bold !text-white">Visit or write</h2>
            <p className="mt-4 text-sm">hello@bluekick.store</p>
            <p className="mt-1 text-sm">Mon–Fri, 9am – 5pm</p>
            <p className="mt-1 text-sm">We reply within one business day.</p>
          </div>
          <h2 className="mt-10 text-2xl font-bold">FAQ</h2>
          <div className="panel mt-4 divide-y-2 divide-grey-900 px-5">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium text-grey-900">
                  {f.q}
                  <span className="text-xl text-grey-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-grey-500">{f.a}</p>
              </details>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
