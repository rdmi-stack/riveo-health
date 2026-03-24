/* ───────────────────────────────────────────────────────
   Pre-Collection Engagement Workflow
   POST /api/pre-collection — Generate escalation plan for overdue accounts
   GET /api/pre-collection — List accounts in pre-collection
   PATCH /api/pre-collection — Advance to next step or resolve
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";
import { ObjectId } from "mongodb";

const COL = "pre_collection";
async function col() { return (await getDb()).collection(COL); }

const ESCALATION_STEPS = [
  { step: 1, name: "Digital Statement", channel: "email", daysAfterDue: 0, description: "Send digital bill via email with one-click payment link" },
  { step: 2, name: "SMS Reminder", channel: "sms", daysAfterDue: 7, description: "Friendly text reminder with payment link" },
  { step: 3, name: "Email Follow-Up", channel: "email", daysAfterDue: 14, description: "Second email with balance explanation and payment plan offer" },
  { step: 4, name: "Payment Plan Offer", channel: "sms+email", daysAfterDue: 21, description: "Proactive payment plan with specific monthly amount" },
  { step: 5, name: "Phone Outreach", channel: "phone", daysAfterDue: 30, description: "Personal call from billing team to discuss options" },
  { step: 6, name: "Hardship Screening", channel: "email", daysAfterDue: 45, description: "Financial assistance application and Medicaid eligibility check" },
  { step: 7, name: "Final Notice", channel: "mail+email", daysAfterDue: 60, description: "Final notice before external collections — last chance for payment plan" },
];

// ── Generate pre-collection plans for overdue accounts ─
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accounts, orgId = "demo" } = body;

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json({ error: "accounts array required" }, { status: 400 });
    }

    const c = await col();
    const plans: any[] = [];

    for (const acct of accounts.slice(0, 30)) {
      const daysPastDue = acct.daysPastDue || 0;
      const currentStep = ESCALATION_STEPS.findIndex(s => s.daysAfterDue > daysPastDue);
      const activeStep = currentStep > 0 ? currentStep : daysPastDue >= 60 ? 6 : 0;

      const plan = {
        orgId,
        patientId: acct.patientId || `PAT-${Math.random().toString(36).slice(2, 8)}`,
        balance: acct.balance || 0,
        daysPastDue,
        currentStep: activeStep + 1,
        totalSteps: ESCALATION_STEPS.length,
        escalationPlan: ESCALATION_STEPS,
        nextAction: ESCALATION_STEPS[activeStep] || ESCALATION_STEPS[6],
        status: daysPastDue >= 60 ? "final_notice" : daysPastDue >= 30 ? "active_outreach" : "early_engagement",
        paymentPlanOffered: daysPastDue >= 21,
        hardshipScreened: daysPastDue >= 45,
        createdAt: new Date(),
      };
      plans.push(plan);
    }

    // Generate AI message templates for the batch
    const topAccounts = plans.slice(0, 5).map(p =>
      `Patient ${p.patientId}: Balance=$${p.balance}, DaysPastDue=${p.daysPastDue}, CurrentStep=${p.currentStep}/${p.totalSteps}, NextAction=${p.nextAction.name}`
    ).join("\n");

    const aiResponse = await chatCompletion(
      "You are a healthcare patient collections specialist. Generate empathetic but effective collection messages that maximize payment while maintaining patient relationships. Use behavioral economics: loss aversion, reciprocity, social proof.",
      `Generate personalized collection messages for these overdue accounts:\n\n${topAccounts}\n\nReturn JSON:\n{\n  "messages": [\n    {\n      "patientId": string,\n      "smsMessage": "Text message (under 160 chars)",\n      "emailSubject": "Email subject line",\n      "emailBody": "Email body (2-3 paragraphs, include specific balance, payment link placeholder, and empathetic tone)",\n      "paymentPlanSuggestion": "Specific plan terms if balance > $200",\n      "tone": "empathetic" | "informative" | "urgent"\n    }\n  ]\n}`,
      { temperature: 0.3, maxTokens: 2000, responseFormat: "json" }
    );

    let messages;
    try { messages = JSON.parse(aiResponse); } catch { messages = null; }

    // Save all plans
    if (plans.length > 0) {
      await c.deleteMany({ orgId, status: { $ne: "resolved" } });
      await c.insertMany(plans);
    }

    return NextResponse.json({
      success: true,
      totalAccounts: plans.length,
      breakdown: {
        earlyEngagement: plans.filter(p => p.status === "early_engagement").length,
        activeOutreach: plans.filter(p => p.status === "active_outreach").length,
        finalNotice: plans.filter(p => p.status === "final_notice").length,
      },
      totalOutstanding: plans.reduce((s, p) => s + p.balance, 0),
      aiMessages: messages?.messages || null,
    });
  } catch (error) {
    console.error("Pre-collection error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── List pre-collection accounts ───────────────────────
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const status = req.nextUrl.searchParams.get("status");
    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    const items = await c.find(filter).sort({ daysPastDue: -1 }).limit(100).toArray();
    const totalOutstanding = items.reduce((s: number, i: any) => s + (i.balance || 0), 0);
    return NextResponse.json({ accounts: items, total: items.length, totalOutstanding });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ── Update account status ──────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const c = await col();
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (action === "advance") {
      const item = await c.findOne({ _id: new ObjectId(id) });
      if (item && item.currentStep < 7) {
        update.currentStep = item.currentStep + 1;
        update.nextAction = ESCALATION_STEPS[item.currentStep]; // next step
      }
    } else if (action === "resolve") {
      update.status = "resolved";
      update.resolvedAt = new Date();
    } else if (action === "send_to_collections") {
      update.status = "external_collections";
      update.sentToCollectionsAt = new Date();
    }
    await c.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
