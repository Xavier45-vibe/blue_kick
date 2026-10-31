/**
 * Domain model for the catalogue (Blue Kick spec, section 4).
 * SOLID: Single Responsibility - this file only describes data shapes.
 * Money is always stored in cents.
 */

export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  attributes: Record<string, string>;
}

export interface Inventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  image?: string;
  position: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  inventory: Inventory;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  createdAt: string;
  updatedAt: string;
  /** Presentation hint used by the placeholder artwork (no photos are bundled). */
  tone: [string, string];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  position: number;
  tone: [string, string];
}
