import type { Product } from "@/domain/product";
import { buildProduct } from "./product-factory";
import { seedsA } from "./products-a";
import { seedsB } from "./products-b";

export const products: Product[] = [...seedsA, ...seedsB].map(buildProduct);
