import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Database-backed pages are rendered per request (`dynamic = "force-dynamic"`),
  // so the build never needs a live database.
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "bcryptjs"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
