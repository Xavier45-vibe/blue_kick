import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Blue Kick collects, uses and protects your personal data.",
};

const sections = [
  { h: "What we collect", p: "We collect the details you give us: your name, email, delivery address, phone number and order history. We also collect basic, anonymous usage data to improve the site." },
  { h: "How we use it", p: "We use your data to process and deliver orders, answer your questions and, only if you opt in, to send newsletters. We never sell your personal data." },
  { h: "Legal basis", p: "We process data to fulfil our contract with you, to meet legal obligations, for our legitimate interests in running the shop, and with your consent for marketing." },
  { h: "Sharing", p: "We share only what is needed with trusted providers such as payment processors (Paystack, PayPal), couriers and our email service. They may only use it to provide their service." },
  { h: "Retention", p: "We keep order records for as long as the law requires. Newsletter data is kept until you unsubscribe." },
  { h: "Your rights", p: "Under GDPR and similar laws you may access, correct, export or delete your data, object to processing and withdraw consent at any time. Email hello@bluekick.store and we will respond within 30 days." },
  { h: "Cookies and storage", p: "We use local storage to remember your cart. We do not use advertising cookies." },
  { h: "Changes", p: "We will post any changes to this policy on this page. Last updated: October 24, 2026." },
];

export default function PrivacyPage() {
  return (
    <div className="container-bk max-w-3xl py-12 sm:py-16">
      <p className="sticker sticker-violet -rotate-2">Legal</p>
      <h1 className="mt-3 text-5xl font-black">Privacy Policy</h1>
      <p className="mt-3 text-grey-600">Plain-language, GDPR-friendly. Your data is yours.</p>
      <div className="mt-10 space-y-5">
        {sections.map((s, i) => (
          <section key={s.h} className="panel p-6">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span className="sticker sticker-gold">{String(i + 1).padStart(2, "0")}</span>
              {s.h}
            </h2>
            <p className="mt-3 leading-relaxed text-grey-600">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
