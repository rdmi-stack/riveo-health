/* ───────────────────────────────────────────────────────
   Demo Data Seeder — Generates realistic claims data
   for the dashboard demo. Run via /api/seed endpoint.
   ─────────────────────────────────────────────────────── */

import { getCollection, Collections } from "./mongodb";

const PAYERS = [
  { name: "Medicare", payerId: "MCR", denialRate: 0.08 },
  { name: "Blue Cross Blue Shield", payerId: "BCBS", denialRate: 0.14 },
  { name: "UnitedHealthcare", payerId: "UHC", denialRate: 0.16 },
  { name: "Aetna", payerId: "AET", denialRate: 0.13 },
  { name: "Cigna", payerId: "CIG", denialRate: 0.15 },
  { name: "Medicaid", payerId: "MCD", denialRate: 0.18 },
];

const CPT_CODES = [
  { code: "99213", desc: "Office visit, est. patient, level 3", avgCharge: 150 },
  { code: "99214", desc: "Office visit, est. patient, level 4", avgCharge: 220 },
  { code: "99215", desc: "Office visit, est. patient, level 5", avgCharge: 310 },
  { code: "99203", desc: "Office visit, new patient, level 3", avgCharge: 200 },
  { code: "99204", desc: "Office visit, new patient, level 4", avgCharge: 300 },
  { code: "99232", desc: "Subsequent hospital care, level 2", avgCharge: 140 },
  { code: "73721", desc: "MRI lower extremity joint", avgCharge: 850 },
  { code: "71046", desc: "Chest X-ray, 2 views", avgCharge: 120 },
  { code: "93000", desc: "Electrocardiogram, complete", avgCharge: 90 },
  { code: "36415", desc: "Venipuncture", avgCharge: 35 },
];

const ICD_CODES = [
  "E11.9", "I10", "J06.9", "M54.5", "Z00.00",
  "R10.9", "K21.0", "J44.1", "E78.5", "F41.1",
  "M79.3", "R05.9", "N39.0", "G43.909", "L30.9",
];

const DENIAL_REASONS = [
  { code: "CO-16", reason: "Claim/service lacks information needed for adjudication", fix: "Submit missing documentation including patient demographics, referring physician NPI, and prior authorization number." },
  { code: "CO-22", reason: "This care may be covered by another payer per coordination of benefits", fix: "Verify COB with patient, update primary/secondary payer order, resubmit to correct payer." },
  { code: "CO-197", reason: "Precertification/authorization/notification absent", fix: "Obtain retroactive authorization from payer. Submit auth number with corrected claim." },
  { code: "CO-4", reason: "The procedure code is inconsistent with the modifier used", fix: "Review CPT/modifier combination. Remove or change modifier per payer guidelines. Resubmit." },
  { code: "CO-18", reason: "Duplicate claim/service", fix: "Verify claim was not previously paid. If different date/service, add modifier or documentation to distinguish." },
  { code: "CO-29", reason: "The time limit for filing has expired", fix: "Check payer timely filing limit. File appeal with proof of timely submission if applicable." },
  { code: "CO-97", reason: "Payment included in the allowance for another service/procedure", fix: "Review bundling rules. Use modifier 59 or appropriate XE/XP/XS/XU modifier if services are distinct." },
  { code: "CO-50", reason: "Non-covered service", fix: "Verify medical necessity. Submit appeal with supporting clinical documentation and letter of medical necessity." },
];

const PROVIDERS = [
  "Dr. Sarah Chen", "Dr. James Wilson", "Dr. Maria Garcia",
  "Dr. Robert Kim", "Dr. Emily Johnson",
];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export async function seedDemoData(orgId: string) {
  const claimsCol = await getCollection(Collections.CLAIMS);
  const denialsCol = await getCollection(Collections.DENIALS);
  const payersCol = await getCollection(Collections.PAYERS);

  // Clear existing demo data for this org
  await claimsCol.deleteMany({ orgId });
  await denialsCol.deleteMany({ orgId });
  await payersCol.deleteMany({ orgId });

  // Seed payers
  await payersCol.insertMany(PAYERS.map(p => ({
    ...p, orgId, createdAt: new Date(),
  })));

  const claims: any[] = [];
  const denials: any[] = [];

  // Generate 500 claims over last 90 days
  for (let i = 0; i < 500; i++) {
    const payer = pick(PAYERS);
    const cpt = pick(CPT_CODES);
    const icd = pick(ICD_CODES);
    const provider = pick(PROVIDERS);
    const daysAgo = rand(1, 90);
    const dos = new Date(Date.now() - daysAgo * 86400000);
    const submitted = new Date(dos.getTime() + rand(0, 3) * 86400000);

    const isDenied = Math.random() < payer.denialRate;
    const isPending = !isDenied && Math.random() < 0.1;
    const isPartial = !isDenied && !isPending && Math.random() < 0.08;

    const billedAmount = cpt.avgCharge + rand(-20, 50);
    const allowedAmount = isDenied ? 0 : Math.round(billedAmount * (0.6 + Math.random() * 0.3));
    const paidAmount = isDenied ? 0 : isPartial ? Math.round(allowedAmount * 0.7) : isPending ? 0 : allowedAmount;
    const status = isDenied ? "denied" : isPending ? "pending" : isPartial ? "partial" : "paid";

    const denialInfo = isDenied ? pick(DENIAL_REASONS) : null;
    const claimId = `CLM-${String(i + 1).padStart(5, "0")}`;
    const patientId = `PAT-${String(rand(1, 200)).padStart(4, "0")}`;

    const claim = {
      orgId,
      claimId,
      patientId,
      dateOfService: dos,
      payer: payer.name,
      payerId: payer.payerId,
      cptCode: cpt.code,
      cptDescription: cpt.desc,
      icdCode: icd,
      billedAmount,
      allowedAmount,
      paidAmount,
      status,
      denialCode: denialInfo?.code || null,
      denialReason: denialInfo?.reason || null,
      provider,
      submittedAt: submitted,
      paidAt: status === "paid" || status === "partial" ? new Date(submitted.getTime() + rand(15, 55) * 86400000) : null,
      createdAt: new Date(),
    };
    claims.push(claim);

    if (isDenied) {
      denials.push({
        orgId,
        claimId,
        patientId,
        payer: payer.name,
        billedAmount,
        denialCode: denialInfo!.code,
        denialReason: denialInfo!.reason,
        suggestedFix: denialInfo!.fix,
        priority: billedAmount > 500 ? "high" : billedAmount > 200 ? "medium" : "low",
        status: Math.random() < 0.3 ? "in_progress" : Math.random() < 0.1 ? "resolved" : "new",
        dateOfService: dos,
        submittedAt: submitted,
        createdAt: new Date(),
      });
    }
  }

  await claimsCol.insertMany(claims);
  await denialsCol.insertMany(denials);

  return {
    claimsCreated: claims.length,
    denialsCreated: denials.length,
    payersCreated: PAYERS.length,
  };
}
