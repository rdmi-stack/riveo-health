/* ───────────────────────────────────────────────────────
   White-Label API
   POST /api/white-label — Create/update white-label config
   GET /api/white-label — Get white-label config for org
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

const COLLECTION = "white_label_configs";

// ── Create / Update white-label config ─────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orgId = "demo",
      companyName,
      logoUrl,
      primaryColor,
      accentColor,
      customDomain,
      supportEmail,
      supportPhone,
      favicon,
      loginMessage,
      dashboardTitle,
      hideRiveoBranding,
      customCSS,
    } = body;

    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }

    const col = await getCollection(COLLECTION);

    const config = {
      orgId,
      branding: {
        companyName: companyName.trim(),
        logoUrl: logoUrl?.trim() || null,
        favicon: favicon?.trim() || null,
        primaryColor: primaryColor || "#4F46E5",
        accentColor: accentColor || "#06B6D4",
        hideRiveoBranding: hideRiveoBranding || false,
        customCSS: customCSS || null,
      },
      customDomain: customDomain?.trim() || null,
      support: {
        email: supportEmail?.trim() || null,
        phone: supportPhone?.trim() || null,
      },
      ui: {
        loginMessage: loginMessage?.trim() || "Sign in to your account",
        dashboardTitle: dashboardTitle?.trim() || "Revenue Dashboard",
      },
      status: "active",
      updatedAt: new Date(),
    };

    await col.updateOne(
      { orgId },
      { $set: config, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        previewUrl: customDomain
          ? `https://${customDomain}`
          : `https://app.riveohealth.com/${orgId}`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("White-label error:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}

// ── Get white-label config ─────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const domain = sp.get("domain");

    const col = await getCollection(COLLECTION);

    let config;
    if (domain) {
      config = await col.findOne({ customDomain: domain });
    } else {
      config = await col.findOne({ orgId });
    }

    if (!config) {
      return NextResponse.json({
        config: null,
        defaults: {
          companyName: "Riveo Health",
          primaryColor: "#4F46E5",
          accentColor: "#06B6D4",
          logoUrl: null,
        },
      });
    }

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
