/* ───────────────────────────────────────────────────────
   POST /api/auth/login — Authenticate user, return JWT
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { logLogin } from "@/lib/audit-logger";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Rate limit: 10 attempts per email per 15 minutes
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`login:${email || ip}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please try again in 15 minutes." }, { status: 429 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const usersCol = await getCollection(Collections.USERS);
    const orgsCol = await getCollection(Collections.ORGANIZATIONS);

    // Find user
    const user = await usersCol.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      await logLogin("unknown", "unknown", email, req, false);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await logLogin(user._id.toString(), user.orgId, email, req, false);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Get org
    const { ObjectId } = await import("mongodb");
    const org = await orgsCol.findOne({ _id: new ObjectId(user.orgId) });

    // Create token
    const token = await createToken({
      userId: user._id.toString(),
      orgId: user.orgId,
      email: user.email,
      role: user.role,
      orgName: org?.name || "Unknown",
    });

    // Set cookie
    await setAuthCookie(token);

    // Update last login
    await usersCol.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // Audit log
    await logLogin(user._id.toString(), user.orgId, email, req, true);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      org: {
        id: user.orgId,
        name: org?.name || "Unknown",
        onboardingComplete: org?.onboardingComplete || false,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
