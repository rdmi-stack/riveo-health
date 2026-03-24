/* ───────────────────────────────────────────────────────
   API Auth Helper — Enforces authentication on API routes
   Use: const user = await requireAuth(req); if (!user) return unauthorized();
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, AuthUser } from "./auth";

/**
 * Returns authenticated user or null.
 * For protected endpoints, check the result and return unauthorized() if null.
 * Falls back to "demo" org for development/demo purposes only.
 */
export async function getAuthOrDemo(req: NextRequest): Promise<{ user: AuthUser | null; orgId: string }> {
  const user = await getUserFromRequest(req);
  if (user) {
    return { user, orgId: user.orgId };
  }
  // In production, return null. For now, allow demo access via query param.
  const orgParam = req.nextUrl.searchParams.get("org");
  if (orgParam === "demo") {
    return { user: null, orgId: "demo" };
  }
  return { user: null, orgId: "" };
}

/**
 * Strict auth check — returns user or 401 response.
 * Use for endpoints that must never be publicly accessible.
 */
export async function requireAuth(req: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
}
