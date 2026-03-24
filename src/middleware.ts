/* ───────────────────────────────────────────────────────
   Middleware — Protects /dashboard routes
   Redirects to /login if no valid auth cookie
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "riveo-health-secret-change-me");
const TOKEN_NAME = "riveo_token";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard"];

// Routes that should redirect to dashboard if already logged in
const AUTH_PATHS = ["/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_NAME)?.value;

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some(p => pathname === p);

  // Verify token
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Invalid token — clear it
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete(TOKEN_NAME);
      if (isProtected) return response;
    }
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
