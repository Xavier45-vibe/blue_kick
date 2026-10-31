/** Cart and order domain types. Pure data, no behaviour. */

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  tone: [string, string];
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "unfulfilled" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  number: string;
  idempotencyKey: string;
  email: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingMethodId: string;
  shippingMethodName: string;
  estimatedDelivery: string;
  paymentMethod: string;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  note?: string;
  createdAt: string;
}

export interface CheckoutRequest {
  idempotencyKey: string;
  email: string;
  newsletterOptIn: boolean;
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethodId: string;
  paymentMethod: string;
  promoCode?: string;
  note?: string;
  lines: CartLine[];
}
