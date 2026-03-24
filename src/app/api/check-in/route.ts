/* Digital Check-In / Patient Intake — POST: submit, GET: list */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COL = "patient_checkins";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orgId = "demo" } = body;

    if (action === "submit") {
      const { patientId, firstName, lastName, dob, phone, email, insurance, allergies, medications, reasonForVisit, consentSigned } = body;
      const c = await col();
      const result = await c.insertOne({
        orgId, patientId: patientId || `PAT-${Date.now().toString(36)}`,
        firstName, lastName, dob, phone, email,
        insurance: insurance || {}, allergies: allergies || [], medications: medications || [],
        reasonForVisit: reasonForVisit || "", consentSigned: consentSigned || false,
        status: "completed", completedAt: new Date(), createdAt: new Date(),
      });
      return NextResponse.json({ success: true, id: result.insertedId.toString() });
    }

    if (action === "seed_demo") {
      const c = await col();
      const demos = [
        { orgId, patientId: "PAT-0012", firstName: "Sarah", lastName: "Johnson", dob: "1978-05-12", phone: "+15551234567", email: "sarah@email.com", insurance: { payer: "UnitedHealthcare", memberId: "UHC123" }, allergies: ["Penicillin"], medications: ["Metformin 500mg"], reasonForVisit: "Follow-up diabetes", consentSigned: true, status: "completed", completedAt: new Date(), createdAt: new Date() },
        { orgId, patientId: "PAT-0034", firstName: "Michael", lastName: "Brown", dob: "1965-11-03", phone: "+15559876543", email: "michael@email.com", insurance: { payer: "Medicare", memberId: "MCR456" }, allergies: [], medications: ["Lisinopril 20mg", "Atorvastatin 40mg"], reasonForVisit: "Annual physical", consentSigned: true, status: "completed", completedAt: new Date(), createdAt: new Date(Date.now() - 86400000) },
        { orgId, patientId: "PAT-0056", firstName: "Emily", lastName: "Davis", dob: "1990-08-22", phone: "+15551112222", email: "emily@email.com", insurance: { payer: "Aetna", memberId: "AET789" }, allergies: ["Sulfa"], medications: [], reasonForVisit: "Knee pain", consentSigned: false, status: "in_progress", createdAt: new Date() },
      ];
      await c.deleteMany({ orgId });
      await c.insertMany(demos);
      return NextResponse.json({ success: true, count: demos.length });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(30).toArray();
    return NextResponse.json({ checkins: items, total: items.length, completed: items.filter((i: any) => i.status === "completed").length });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
