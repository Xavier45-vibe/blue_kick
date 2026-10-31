import type { ContactStore, NewsletterStore } from "./ports";

export class ValidationError extends Error {}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class NewsletterService {
  constructor(
    private readonly store: NewsletterStore,
    private readonly onSubscribed?: (email: string) => Promise<void>,
  ) {}
  async subscribe(email: string, source = "website") {
    const clean = email.trim();
    if (!EMAIL.test(clean) || clean.length > 254) throw new ValidationError("Please enter a valid email address.");
    const result = await this.store.add(clean, source);
    if (result.created && this.onSubscribed) await this.onSubscribed(clean);
    return result;
  }
}

export class ContactService {
  constructor(private readonly store: ContactStore) {}
  async submit(input: { name: string; email: string; message: string }) {
    const name = input.name.trim();
    const message = input.message.trim();
    if (name.length < 2) throw new ValidationError("Please tell us your name.");
    if (!EMAIL.test(input.email.trim())) throw new ValidationError("Please enter a valid email address.");
    if (message.length < 10) throw new ValidationError("Your message is a little short.");
    await this.store.save({ name, email: input.email.trim(), message: message.slice(0, 2000) });
  }
}
