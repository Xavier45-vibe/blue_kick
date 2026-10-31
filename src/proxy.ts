/** Protects every /admin/* route (Next 16 `proxy`, formerly `middleware`). */
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const open = pathname === "/admin/login" || pathname.startsWith("/admin/forgot-password") || pathname.startsWith("/admin/reset-password");
  if (pathname.startsWith("/admin") && !open && !req.auth) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*"] };
