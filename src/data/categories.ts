import type { Category } from "@/domain/product";

export const categories: Category[] = [
  { id: "cat-drawing", name: "Drawing & Sketching", slug: "drawing-sketching", description: "Pencils, charcoal and inks.", parentId: null, position: 1, isActive: true },
  { id: "cat-painting", name: "Painting", slug: "painting", description: "Watercolor, acrylic and oil.", parentId: null, position: 2, isActive: true },
  { id: "cat-brushes", name: "Brushes & Tools", slug: "brushes-tools", description: "Brushes, knives and palettes.", parentId: null, position: 3, isActive: true },
  { id: "cat-paper", name: "Paper & Surfaces", slug: "paper-surfaces", description: "Pads, canvases and boards.", parentId: null, position: 4, isActive: true },
  { id: "cat-calligraphy", name: "Calligraphy & Lettering", slug: "calligraphy-lettering", description: "Nibs, inks and brush pens.", parentId: null, position: 5, isActive: true },
  { id: "cat-sets", name: "Sets & Kits", slug: "sets-kits", description: "Curated bundles.", parentId: null, position: 6, isActive: true },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", description: "Easels, totes and storage.", parentId: null, position: 7, isActive: true },
];
