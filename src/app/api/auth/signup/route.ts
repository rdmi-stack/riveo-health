/* ───────────────────────────────────────────────────────
   POST /api/auth/signup — Create account + organization
   INTERNAL USE ONLY — called by admin to onboard new clients
   after demo call + agreement signed. Not publicly accessible
   from the website (no public signup form exists).
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { logAudit, getRequestMeta } from "@/lib/audit-logger";
import { validatePassword } from "@/lib/compliance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, orgName, specialty, physicians } = body;

    // Validate
    if (!firstName || !email || !password || !orgName) {
      return NextResponse.json(
        { error: "firstName, email, password, and orgName are required" },
        { status: 400 }
      );
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return NextResponse.json({ error: `Password requirements: ${pwCheck.errors.join(", ")}` }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const usersCol = await getCollection(Collections.USERS);
    const orgsCol = await getCollection(Collections.ORGANIZATIONS);

    // Check if email already exists
    const existing = await usersCol.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Create organization
    const org = await orgsCol.insertOne({
      name: orgName.trim(),
      specialty: specialty?.trim() || "Multi-Specialty",
      physicians: parseInt(physicians) || 1,
      plan: "starter",
      onboardingComplete: false,
      settings: {
        notifications: { newDenials: true, highValueDenials: true, weeklySummary: false },
        timezone: "America/New_York",
      },
      createdAt: new Date(),
    });

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await usersCol.insertOne({
      orgId: org.insertedId.toString(),
      firstName: firstName.trim(),
      lastName: lastName?.trim() || "",
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "admin",
      lastLogin: new Date(),
      createdAt: new Date(),
    });

    // Create JWT token
    const token = await createToken({
      userId: user.insertedId.toString(),
      orgId: org.insertedId.toString(),
      email: email.trim().toLowerCase(),
      role: "admin",
      orgName: orgName.trim(),
    });

    // Set cookie
    await setAuthCookie(token);

    // Audit log
    const meta = getRequestMeta(req);
    await logAudit({
      userId: user.insertedId.toString(),
      orgId: org.insertedId.toString(),
      userEmail: email.toLowerCase(),
      action: "create",
      entityType: "auth",
      description: `New account created: ${email} for org "${orgName}"`,
      ...meta,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.insertedId.toString(),
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
        email: email.trim().toLowerCase(),
        role: "admin",
      },
      org: {
        id: org.insertedId.toString(),
        name: orgName.trim(),
        onboardingComplete: false,
      },
      token,
    }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
