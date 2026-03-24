/* ───────────────────────────────────────────────────────
   Auth Utilities — JWT, password hashing, session helpers
   ─────────────────────────────────────────────────────── */

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production");
}
const JWT_SECRET = new TextEncoder().encode(jwtSecret || "riveo-dev-secret-not-for-production");
const TOKEN_NAME = "riveo_token";
const TOKEN_EXPIRY = "7d";

// ── Types ──────────────────────────────────────────────

export interface TokenPayload {
  userId: string;
  orgId: string;
  email: string;
  role: "admin" | "billing_manager" | "biller" | "viewer";
  orgName: string;
}

export interface AuthUser extends TokenPayload {
  iat: number;
  exp: number;
}

// ── Password Hashing ───────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── JWT Token ──────────────────────────────────────────

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

// ── Cookie Helpers ─────────────────────────────────────

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// ── Get current user from cookie ───────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

// ── Get user from request header (for API routes) ──────

export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  // Try cookie first
  const cookieToken = req.cookies.get(TOKEN_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  // Try Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }

  return null;
}

// ── Role check helpers ─────────────────────────────────

const ROLE_HIERARCHY: Record<string, number> = {
  admin: 4,
  billing_manager: 3,
  biller: 2,
  viewer: 1,
};

export function hasRole(userRole: string, requiredRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}
