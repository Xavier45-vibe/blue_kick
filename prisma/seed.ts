/**
 * Seeds the database: Super Admin, categories, products, team and default settings.
 * Run with: npm.cmd run db:seed   (safe to re-run; it upserts)
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { team } from "../src/data/team";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@bluekick.store").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Blue Kick Admin", role: "SUPER_ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });

  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { id: c.id, name: c.name, slug: c.slug, description: c.description, position: c.position, isActive: c.isActive },
    });
  }

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku: p.sku,
        status: "active",
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        categoryId: p.categoryId,
        tags: p.tags,
        quantity: p.inventory.quantity,
        lowStockThreshold: p.inventory.lowStockThreshold,
        weight: p.weight,
        toneFrom: p.tone[0],
        toneTo: p.tone[1],
        variants: {
          create: p.variants.map((v) => ({ name: v.name, sku: v.sku, price: v.price, inventoryQuantity: v.inventoryQuantity, attributes: v.attributes })),
        },
      },
    });
  }

  if ((await db.teamMember.count()) === 0) {
    for (const t of team) {
      await db.teamMember.create({ data: { name: t.name, role: t.role, bio: t.bio, position: t.position, toneFrom: t.tone[0], toneTo: t.tone[1] } });
    }
  }

  await db.contentBlock.upsert({
    where: { key: "landing" },
    update: {},
    create: {
      key: "landing",
      data: {
        heroEyebrow: "Family-owned art supplies",
        heroTitle: "Art supplies with a little glamour.",
        heroText: "Polished quality, honest prices and a splash of colour for every maker.",
        featuredTitle: "Studio favourites",
        featuredText: "The pieces our community reaches for again and again.",
        teamTitle: "A family that loves art",
        teamText: "Blue Kick began around a kitchen table. Today the whole family still packs, picks and answers your emails.",
        newsletterTitle: "Get 10% off your first order",
        newsletterText: "Join our list for new arrivals, studio tips and subscriber-only offers.",
      },
    },
  });

  console.log(`Seeded. Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
