/* ───────────────────────────────────────────────────────
   EHR Integration API
   POST /api/ehr — Connect EHR system (store credentials)
   GET /api/ehr — Get connection status
   POST /api/ehr/sync — Trigger claim sync (simulated for MVP)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

const COLLECTION = "ehr_connections";

// Supported EHR systems and their integration details
const EHR_SYSTEMS: Record<string, { name: string; type: string; standard: string; fields: string[] }> = {
  athenahealth: {
    name: "athenahealth",
    type: "REST API + FHIR",
    standard: "HL7 FHIR R4",
    fields: ["practiceId", "apiKey", "apiSecret"],
  },
  epic: {
    name: "Epic",
    type: "FHIR R4",
    standard: "HL7 FHIR R4",
    fields: ["clientId", "fhirEndpoint", "privateKey"],
  },
  cerner: {
    name: "Oracle Health (Cerner)",
    type: "FHIR R4",
    standard: "HL7 FHIR R4",
    fields: ["clientId", "clientSecret", "fhirEndpoint"],
  },
  eclinicalworks: {
    name: "eClinicalWorks",
    type: "HL7 + REST API",
    standard: "HL7v2 / REST",
    fields: ["practiceId", "apiToken", "endpoint"],
  },
  allscripts: {
    name: "Allscripts",
    type: "Unity API",
    standard: "HL7 FHIR R4",
    fields: ["appName", "appUsername", "appPassword", "serviceUrl"],
  },
  nextgen: {
    name: "NextGen",
    type: "REST API",
    standard: "HL7 FHIR R4",
    fields: ["siteId", "apiKey", "endpoint"],
  },
};

// ── Connect EHR ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId = "demo", ehrSystem, credentials, syncFrequency = "daily" } = body;

    if (!ehrSystem || !EHR_SYSTEMS[ehrSystem]) {
      return NextResponse.json({
        error: "Invalid EHR system",
        supported: Object.keys(EHR_SYSTEMS),
      }, { status: 400 });
    }

    const ehr = EHR_SYSTEMS[ehrSystem];

    // Validate required fields
    const missing = ehr.fields.filter(f => !credentials?.[f]);
    if (missing.length > 0) {
      return NextResponse.json({
        error: `Missing credentials: ${missing.join(", ")}`,
        required: ehr.fields,
      }, { status: 400 });
    }

    const col = await getCollection(COLLECTION);

    // Upsert connection
    await col.updateOne(
      { orgId, ehrSystem },
      {
        $set: {
          orgId,
          ehrSystem,
          ehrName: ehr.name,
          integrationType: ehr.type,
          standard: ehr.standard,
          credentials, // In production: encrypt these at rest
          syncFrequency,
          status: "connected",
          lastSync: null,
          claimsSynced: 0,
          connectedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      connection: {
        ehrSystem: ehr.name,
        status: "connected",
        syncFrequency,
        message: `Successfully connected to ${ehr.name}. First sync will begin within ${syncFrequency === "realtime" ? "5 minutes" : "1 hour"}.`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("EHR connect error:", error);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}

// ── Get connection status ──────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const col = await getCollection(COLLECTION);
    const connections = await col.find({ orgId }).toArray();

    // Return sanitized (no credentials)
    const sanitized = connections.map(c => ({
      _id: c._id,
      ehrSystem: c.ehrSystem,
      ehrName: c.ehrName,
      status: c.status,
      syncFrequency: c.syncFrequency,
      lastSync: c.lastSync,
      claimsSynced: c.claimsSynced,
      connectedAt: c.connectedAt,
    }));

    return NextResponse.json({
      connections: sanitized,
      supported: Object.entries(EHR_SYSTEMS).map(([key, val]) => ({
        id: key,
        name: val.name,
        type: val.type,
        standard: val.standard,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
