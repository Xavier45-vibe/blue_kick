# Blue Kick

Family-owned art supplies store. Next.js 16, Tailwind 4, Prisma 7 (PostgreSQL), Auth.js (NextAuth v5), Cloudinary, Resend, Paystack.

## First run (Windows: use `npm.cmd`)

1. Put your PostgreSQL URL in `.env` as `DATABASE_URL` (see `.env.example`).
2. `npm.cmd run db:push` creates the tables.
3. `npm.cmd run db:seed` adds the catalogue, team, and a Super Admin (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
4. `npm.cmd run build` then `npm.cmd run start` (or `npm.cmd run dev`).

Storefront: http://localhost:3000. Admin: http://localhost:3000/admin (sign in with the seeded account, then change the password).

## Deploying to Vercel

`.env` is git-ignored, so set these in Vercel > Project > Settings > Environment Variables, then redeploy:

- `DATABASE_URL`: a hosted PostgreSQL URL reachable from the internet (Neon, Supabase, Vercel Postgres). Use the pooled URL. `localhost` will not work.
- `AUTH_SECRET`: required by Auth.js in production (`npx auth secret`).
- `APP_URL`: your public URL (falls back to the Vercel URL).
- `CLOUDINARY_*`: required for image uploads, because Vercel's filesystem is read-only.

Run `npm run db:push` and `npm run db:seed` once against the hosted database from your machine (with `DATABASE_URL` pointing at it).

## Integrations (all optional, with safe fallbacks)

| Service | Env vars | Without them |
|---|---|---|
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET` | images saved to `public/uploads` |
| Resend | `RESEND_API_KEY`, `MAIL_FROM` | emails printed to the server console |
| Paystack | `PAYSTACK_SECRET_KEY` | payments are simulated |

## Architecture (SOLID)

`domain/` types, `services/` business rules behind the interfaces in `services/ports.ts`, `repositories/` Prisma adapters, `infra/` email and storage adapters, `services/container.ts` is the only place concrete classes are chosen.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# blue_kick" 
