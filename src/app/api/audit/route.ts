/* ───────────────────────────────────────────────────────
   POST /api/audit — AI-powered revenue audit analysis
   Accepts manual input → analyzes with GPT → stores result
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";
import { chatCompletion, SYSTEM_PROMPTS } from "@/lib/openai";

interface AuditPayload {
  practiceName: string;
  email?: string;
  phone?: string;
  physicians: number;
  annualRevenue: number;
  monthlyClaimsVolume: number;
  currentDenialRate: number;
  averageDaysInAR: number;
  numberOfBillers: number;
  specialty: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AuditPayload = await req.json();

    // Validate required fields
    if (!body.practiceName || !body.physicians || !body.annualRevenue) {
      return NextResponse.json(
        { error: "practiceName, physicians, and annualRevenue are required" },
        { status: 400 }
      );
    }

    // Build the prompt with practice data (no PHI)
    const prompt = `Analyze this healthcare practice's revenue cycle and identify leakage:

Practice: ${body.practiceName}
Specialty: ${body.specialty}
Physicians: ${body.physicians}
Annual Revenue: $${body.annualRevenue.toLocaleString()}
Monthly Claims Volume: ${body.monthlyClaimsVolume.toLocaleString()}
Current Denial Rate: ${body.currentDenialRate}%
Average Days in A/R: ${body.averageDaysInAR}
Billing Staff: ${body.numberOfBillers}

Provide analysis as JSON with these fields:
{
  "totalLeakageEstimate": number (annual $ amount),
  "recoveryPotential": number (annual $ amount),
  "denialAnalysis": {
    "currentRate": number,
    "industryAverage": 0.12,
    "projectedWithAI": number,
    "topDenialReasons": [{"reason": string, "percentage": number, "fixable": boolean}]
  },
  "leakageSources": [{"source": string, "annualAmount": number, "description": string}],
  "payerInsights": [{"payer": string, "estimatedDenialRate": number, "avgDaysToPayment": number}],
  "recommendations": [{"priority": "critical"|"high"|"medium", "title": string, "description": string, "potentialSavings": number}],
  "roiProjection": {
    "monthlyRiveoCost": number,
    "monthlyRecovery": number,
    "roiMultiple": number,
    "paybackDays": number
  }
}`;

    // Call OpenAI GPT
    const aiResponse = await chatCompletion(
      SYSTEM_PROMPTS.AUDIT_ANALYSIS,
      prompt,
      { model: "gpt-5.4", temperature: 0.2, maxTokens: 3000, responseFormat: "json" }
    );

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      // If JSON parse fails, return the raw text
      analysis = { rawAnalysis: aiResponse, parseError: true };
    }

    // Save to MongoDB
    const auditCollection = await getCollection(Collections.AUDIT_RESULTS);
    const leadCollection = await getCollection(Collections.AUDIT_REQUESTS);

    const auditDoc = {
      input: {
        practiceName: body.practiceName,
        specialty: body.specialty,
        physicians: body.physicians,
        annualRevenue: body.annualRevenue,
        monthlyClaimsVolume: body.monthlyClaimsVolume,
        currentDenialRate: body.currentDenialRate,
        averageDaysInAR: body.averageDaysInAR,
        numberOfBillers: body.numberOfBillers,
      },
      analysis,
      model: "gpt-5.4",
      createdAt: new Date(),
    };

    const auditResult = await auditCollection.insertOne(auditDoc);

    // Also save as a lead if email provided
    if (body.email) {
      await leadCollection.insertOne({
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || "",
        practiceName: body.practiceName,
        specialty: body.specialty,
        physicians: body.physicians,
        annualRevenue: body.annualRevenue,
        auditId: auditResult.insertedId,
        source: "website_audit_tool",
        status: "new",
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        auditId: auditResult.insertedId.toString(),
        analysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Audit analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
