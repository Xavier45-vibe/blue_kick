/**
 * Single Prisma client (Prisma 7 + node-postgres driver adapter).
 * Created lazily so importing this file never needs DATABASE_URL (e.g. during `next build`).
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as { __blueKickDb?: PrismaClient };

function create(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and add your PostgreSQL connection string.");
  }
  // Serverless (Vercel): keep the pool tiny so many function instances do not exhaust Postgres connections.
  const max = process.env.VERCEL ? 1 : 10;
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url, max }) });
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = (globalForDb.__blueKickDb ??= create());
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
