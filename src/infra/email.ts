/**
 * Email adapters behind the `EmailSender` port.
 * Resend when RESEND_API_KEY is set; otherwise messages are printed to the server console.
 */
import { Resend } from "resend";
import type { EmailMessage, EmailSender } from "@/services/ports";

export class ResendSender implements EmailSender {
  private readonly client: Resend;
  constructor(apiKey: string, private readonly from: string) {
    this.client = new Resend(apiKey);
  }
  async send(message: EmailMessage) {
    const { error } = await this.client.emails.send({ from: this.from, to: message.to, subject: message.subject, html: message.html });
    if (error) throw new Error(error.message);
  }
}

export class ConsoleSender implements EmailSender {
  async send(message: EmailMessage) {
    console.log(`[mail:console] to=${message.to} subject="${message.subject}"\n${message.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`);
  }
}

export function createEmailSender(): EmailSender {
  const key = process.env.RESEND_API_KEY;
  if (key) return new ResendSender(key, process.env.MAIL_FROM ?? "Blue Kick <onboarding@resend.dev>");
  return new ConsoleSender();
}
