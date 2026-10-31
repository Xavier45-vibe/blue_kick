import type { ImageItem } from "./image-uploader";
import type { VariantRow } from "./variants-editor";

export interface ProductFormData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  quantity: string;
  lowStockThreshold: string;
  weight: string;
  categoryId: string;
  tags: string;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  seoTitle: string;
  seoDescription: string;
  images: ImageItem[];
  primaryIndex: number;
  variants: VariantRow[];
}

export const emptyProduct: ProductFormData = {
  id: "", name: "", slug: "", shortDescription: "", description: "", price: "", compareAtPrice: "", sku: "", quantity: "0",
  lowStockThreshold: "10", weight: "", categoryId: "", tags: "", status: "draft", isFeatured: false, isNew: false,
  seoTitle: "", seoDescription: "", images: [], primaryIndex: 0, variants: [],
};
