/* ───────────────────────────────────────────────────────
   POST /api/demo — Handles demo request submissions
   Saves to MongoDB
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";

interface DemoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  role?: string;
  organizationType?: string;
  physicians?: number;
  currentSystem?: string;
  challenges?: string;
  timeline?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: DemoPayload = await req.json();

    // Validate required fields
    if (!body.firstName || !body.email || !body.company) {
      return NextResponse.json(
        { error: "firstName, email, and company are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const collection = await getCollection(Collections.DEMO_REQUESTS);

    const doc = {
      firstName: body.firstName.trim(),
      lastName: body.lastName?.trim() || "",
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      company: body.company.trim(),
      role: body.role?.trim() || "",
      organizationType: body.organizationType?.trim() || "",
      physicians: body.physicians || 0,
      currentSystem: body.currentSystem?.trim() || "",
      challenges: body.challenges?.trim() || "",
      timeline: body.timeline?.trim() || "",
      source: "website_demo_form",
      status: "new",
      createdAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId.toString(),
        message: "Demo request received! A revenue cycle expert will contact you within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
