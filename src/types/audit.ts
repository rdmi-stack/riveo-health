/* ───────────────────────────────────────────────────────
   Riveo Health — Free Revenue Audit Tool Types
   ─────────────────────────────────────────────────────── */

// ── Raw claim record (from CSV upload) ───────────────
export interface ClaimRecord {
  claimId: string;
  patientId: string;
  dateOfService: string;
  payer: string;
  cptCode: string;
  icdCode: string;
  billedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  status: "paid" | "denied" | "pending" | "partial";
  denialCode?: string;
  denialReason?: string;
  dateSubmitted: string;
  datePaid?: string;
  provider?: string;
  specialty?: string;
}

// ── Manual entry input ───────────────────────────────
export interface ManualInput {
  practiceName: string;
  physicians: number;
  annualRevenue: number;
  monthlyClaimsVolume: number;
  currentDenialRate: number;
  averageDaysInAR: number;
  numberOfBillers: number;
  specialty: string;
}

// ── Denial breakdown row ─────────────────────────────
export interface DenialBreakdown {
  reason: string;
  code: string;
  count: number;
  percentage: number;
  amount: number;
  recoverable: boolean;
  difficulty: "easy" | "medium" | "hard";
}

// ── Payer-level performance ──────────────────────────
export interface PayerPerformance {
  name: string;
  claimsCount: number;
  denialRate: number;
  avgDaysToPayment: number;
  underpaymentRate: number;
  totalBilled: number;
  totalPaid: number;
}

// ── Leakage source ───────────────────────────────────
export interface LeakageSource {
  source: string;
  annualAmount: number;
  percentage: number;
  fixable: boolean;
  description: string;
}

// ── Recommendation ───────────────────────────────────
export interface Recommendation {
  priority: "critical" | "high" | "medium";
  title: string;
  description: string;
  potentialSavings: number;
  implementation: string;
}

// ── Complete audit results ───────────────────────────
export interface AuditResults {
  // Summary
  totalClaimsAnalyzed: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  totalLeakageFound: number;
  currentDenialRate: number;
  projectedDenialRate: number;
  annualRecoveryPotential: number;

  // Breakdowns
  denialBreakdown: DenialBreakdown[];
  payerPerformance: PayerPerformance[];
  leakageSources: LeakageSource[];

  // Benchmarks
  industryAvgDenialRate: number;
  bestInClassDenialRate: number;
  industryAvgDaysInAR: number;
  currentDaysInAR: number;

  // ROI
  currentAnnualCostOfDenials: number;
  projectedSavingsWithRiveo: number;
  riveoMonthlyCost: number;
  roiMultiple: number;
  paybackDays: number;

  // Recommendations
  recommendations: Recommendation[];
}
