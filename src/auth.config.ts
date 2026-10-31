/**
 * Edge-safe Auth.js config (no database or bcrypt imports) shared by `proxy.ts` and `auth.ts`.
 */
import type { NextAuthConfig } from "next-auth";

export type AppRole = "SUPER_ADMIN" | "STORE_MANAGER";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminArea = pathname.startsWith("/admin");
      const isPublicAdminPage = pathname === "/admin/login" || pathname.startsWith("/admin/forgot-password") || pathname.startsWith("/admin/reset-password");
      if (!isAdminArea || isPublicAdminPage) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: AppRole }).role;
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        (session.user as { role?: AppRole }).role = token.role as AppRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
