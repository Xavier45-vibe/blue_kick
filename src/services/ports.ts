/**
 * Ports (abstractions). High-level services depend on these, never on concrete classes.
 * SOLID: Interface Segregation - many small, role-specific interfaces.
 * SOLID: Dependency Inversion - details (memory, Prisma, Paystack) implement these.
 */
import type { Category, Product, TeamMember } from "@/domain/product";
import type { Address, Order, OrderItem } from "@/domain/order";

export interface ProductReader {
  list(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}

export interface StockWriter {
  /** Atomically reserves stock; returns false when it cannot be satisfied. */
  reserve(productId: string, quantity: number): Promise<boolean>;
  release(productId: string, quantity: number): Promise<void>;
}

export interface CategoryReader {
  list(): Promise<Category[]>;
}

export interface TeamReader {
  list(): Promise<TeamMember[]>;
}

export interface NewsletterStore {
  add(email: string, source: string): Promise<{ created: boolean }>;
}

export interface OrderStore {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByIdempotencyKey(key: string): Promise<Order | null>;
}

export interface ContactStore {
  save(message: { name: string; email: string; message: string }): Promise<void>;
}

export interface PaymentRequest {
  amount: number;
  email: string;
  reference: string;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  message?: string;
}

export interface PaymentProvider {
  readonly id: string;
  readonly label: string;
  charge(request: PaymentRequest): Promise<PaymentResult>;
}

export interface ShippingContext {
  address: Pick<Address, "country">;
  subtotal: number;
  weightGrams: number;
}

export interface ShippingMethod {
  readonly id: string;
  readonly name: string;
  readonly businessDays: [number, number];
  isAvailable(ctx: ShippingContext): boolean;
  price(ctx: ShippingContext): number;
}

export interface PromoRule {
  readonly code: string;
  discount(subtotal: number): number;
}

export interface Mailer {
  sendOrderConfirmation(order: Order): Promise<void>;
}

/** Transport-level email port (Resend in production, console in development). */
export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}
export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}

/** Image storage port (Cloudinary, or local disk when Cloudinary is not configured). */
export interface ImageStorage {
  readonly name: string;
  upload(file: { buffer: Buffer; filename: string; contentType: string }): Promise<{ url: string }>;
}

/** Anything that can list its current options (settings-driven shipping and payments). */
export interface OptionProvider<T> {
  list(): Promise<T[]>;
}

export type { OrderItem };
