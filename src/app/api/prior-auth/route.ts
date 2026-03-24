/* ───────────────────────────────────────────────────────
   POST /api/prior-auth — Generate prior auth request
   GET /api/prior-auth — List prior auth requests
   PATCH /api/prior-auth — Update status
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { chatCompletion, SYSTEM_PROMPTS, maskPHI } from "@/lib/openai";
import { ObjectId } from "mongodb";

const COLLECTION = "prior_auths";

const PA_SYSTEM_PROMPT = `You are a healthcare prior authorization specialist AI for Riveo Health.
You help generate prior authorization requests that maximize approval probability.

Rules:
- Use medical necessity language that matches payer criteria
- Include relevant clinical evidence and supporting documentation requirements
- Reference specific payer guidelines when possible
- Be thorough but concise — payer reviewers scan quickly
- Never fabricate clinical details — only use what's provided
- Return structured JSON format`;

// ── Generate PA request with AI ────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, payer, cptCode, icdCode, procedure, clinicalJustification, provider, orgId = "demo" } = body;

    if (!payer || !cptCode || !procedure) {
      return NextResponse.json({ error: "payer, cptCode, and procedure are required" }, { status: 400 });
    }

    const maskedJustification = clinicalJustification ? maskPHI(clinicalJustification) : "";

    const prompt = `Generate a prior authorization request for:

Patient ID: ${patientId || "N/A"}
Payer: ${payer}
CPT Code: ${cptCode}
ICD-10 Code: ${icdCode || "N/A"}
Procedure: ${procedure}
Provider: ${provider || "N/A"}
Clinical Justification: ${maskedJustification || "Not provided — generate based on procedure and diagnosis"}

Return JSON:
{
  "authRequest": {
    "urgency": "urgent" | "standard",
    "serviceType": "Category of service",
    "medicalNecessityStatement": "2-3 paragraph medical necessity justification using clinical language",
    "supportingCriteria": ["List of clinical criteria that support this request"],
    "requiredDocuments": ["List of documents to attach (labs, imaging, notes, etc.)"],
    "payerSpecificNotes": "Any payer-specific requirements or tips for this authorization",
    "alternativesConsidered": "Statement about conservative treatments already tried",
    "expectedOutcome": "Expected clinical outcome if procedure is authorized"
  },
  "approvalLikelihood": number (0-100),
  "estimatedTimeline": {
    "standardDays": number,
    "urgentDays": number,
    "peerReviewDays": number
  },
  "tips": [
    "Actionable tips to increase approval probability"
  ],
  "appealStrategy": "If denied, what's the best appeal approach"
}`;

    const aiResponse = await chatCompletion(PA_SYSTEM_PROMPT, prompt, {
      temperature: 0.2,
      maxTokens: 2500,
      responseFormat: "json",
    });

    let paData;
    try {
      paData = JSON.parse(aiResponse);
    } catch {
      paData = { rawResponse: aiResponse, parseError: true };
    }

    // Save to MongoDB
    const col = await getCollection(COLLECTION);
    const doc = {
      orgId,
      patientId: patientId || "",
      payer,
      cptCode,
      icdCode: icdCode || "",
      procedure,
      provider: provider || "",
      status: "draft",
      aiGenerated: paData,
      approvalLikelihood: paData.approvalLikelihood || null,
      submittedAt: null,
      respondedAt: null,
      authNumber: null,
      createdAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      priorAuth: paData,
    }, { status: 201 });
  } catch (error) {
    console.error("Prior auth error:", error);
    return NextResponse.json({ error: "Prior auth generation failed" }, { status: 500 });
  }
}

// ── List prior auths ───────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const page = parseInt(sp.get("page") || "1");
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);

    const col = await getCollection(COLLECTION);
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      priorAuths: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Prior auth list error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ── Update status ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, authNumber, notes } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const col = await getCollection(COLLECTION);
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (status) {
      update.status = status;
      if (status === "submitted") update.submittedAt = new Date();
      if (status === "approved" || status === "denied") update.respondedAt = new Date();
    }
    if (authNumber) update.authNumber = authNumber;
    if (notes) update.notes = notes;

    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prior auth update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
