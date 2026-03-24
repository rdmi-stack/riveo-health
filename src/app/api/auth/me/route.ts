/* ───────────────────────────────────────────────────────
   GET /api/auth/me — Get current authenticated user
   POST /api/auth/me — Logout (clear cookie)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, clearAuthCookie } from "@/lib/auth";
import { getCollection, Collections } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const orgsCol = await getCollection(Collections.ORGANIZATIONS);
    const org = await orgsCol.findOne({ _id: new ObjectId(user.orgId) });

    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
      org: {
        id: user.orgId,
        name: user.orgName,
        onboardingComplete: org?.onboardingComplete || false,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}

// Logout
export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ success: true, message: "Logged out" });
}
