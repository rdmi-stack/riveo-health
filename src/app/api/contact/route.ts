/* ───────────────────────────────────────────────────────
   POST /api/contact — Handles contact form submissions
   Saves to MongoDB + sends notification
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    // Validate required fields
    if (!body.firstName || !body.email || !body.message) {
      return NextResponse.json(
        { error: "firstName, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const collection = await getCollection(Collections.CONTACTS);

    const doc = {
      firstName: body.firstName.trim(),
      lastName: body.lastName?.trim() || "",
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      company: body.company?.trim() || "",
      role: body.role?.trim() || "",
      message: body.message.trim(),
      source: "website_contact_form",
      status: "new",
      createdAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId.toString(),
        message: "Thank you! We'll get back to you within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
