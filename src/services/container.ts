/**
 * Composition root: the only place concrete classes are chosen.
 * Swap adapters here without touching services or UI.
 */
import { createEmailSender } from "@/infra/email";
import { createImageStorage } from "@/infra/storage";
import {
  PrismaCategoryRepository,
  PrismaContactStore,
  PrismaNewsletterStore,
  PrismaOrderStore,
  PrismaProductRepository,
  PrismaTeamRepository,
} from "@/repositories/prisma";
import { getSetting } from "@/repositories/settings";
import { CheckoutService } from "./checkout-service";
import { OrderMailer, welcomeHtml } from "./emails";
import { ContactService, NewsletterService } from "./newsletter-service";
import { paymentProviders } from "./payments";
import { promoRules } from "./promos";
import { buildShippingMethods } from "./shipping";

const products = new PrismaProductRepository();
const orders = new PrismaOrderStore();
const newsletterStore = new PrismaNewsletterStore();
const emailSender = createEmailSender();
const appUrl = process.env.APP_URL ?? "http://localhost:3000";

const shippingMethods = async () => buildShippingMethods(await getSetting("shipping"));
const enabledPayments = async () => {
  const s = await getSetting("payments");
  return paymentProviders.filter((p) => (p.id === "paystack" ? s.paystackEnabled : s.paypalEnabled));
};

export const container = {
  products,
  categories: new PrismaCategoryRepository(),
  team: new PrismaTeamRepository(),
  orders,
  email: emailSender,
  images: createImageStorage(),
  newsletter: new NewsletterService(newsletterStore, async (email) => {
    try {
      await emailSender.send({ to: email, subject: "Welcome to Blue Kick", html: welcomeHtml() });
    } catch (e) {
      console.error("[mail] welcome failed:", e);
    }
  }),
  contact: new ContactService(new PrismaContactStore()),
  shippingMethods,
  paymentProviders: enabledPayments,
  checkout: new CheckoutService({
    products,
    orders,
    newsletter: newsletterStore,
    mailer: new OrderMailer(emailSender, appUrl),
    payments: enabledPayments,
    shipping: shippingMethods,
    promos: promoRules,
  }),
};
