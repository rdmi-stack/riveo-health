"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Upload,
  FileSpreadsheet,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Download,
  Phone,
  FileText,
  Building2,
  Users,
  Calendar,
  Activity,
  ChevronRight,
  Printer,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import type { ManualInput, AuditResults } from "@/types/audit";
import {
  parseCSV,
  analyzeCSVClaims,
  analyzeManualInput,
  generateSampleCSV,
} from "@/lib/audit-engine";

/* ═══════════════════════════════════════════════════════
   SPECIALTIES LIST
   ═══════════════════════════════════════════════════════ */
const SPECIALTIES = [
  "Multi-Specialty",
  "Family Medicine",
  "Internal Medicine",
  "Orthopedics",
  "Cardiology",
  "Gastroenterology",
  "Dermatology",
  "Pediatrics",
  "OB/GYN",
  "Radiology",
  "Emergency Medicine",
  "Oncology",
  "Neurology",
  "Urology",
  "Ophthalmology",
  "Other",
];

/* ═══════════════════════════════════════════════════════
   STEP TRACKER
   ═══════════════════════════════════════════════════════ */
type Step = "choose" | "upload" | "manual" | "analyzing" | "results";

/* ═══════════════════════════════════════════════════════
   FORMAT HELPERS
   ═══════════════════════════════════════════════════════ */
function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtNum(n: number): string {
  return n.toLocaleString();
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/* ═══════════════════════════════════════════════════════
   BAR COMPONENT
   ═══════════════════════════════════════════════════════ */
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function AuditPage() {
  const [step, setStep] = useState<Step>("choose");
  const [results, setResults] = useState<AuditResults | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [manual, setManual] = useState<ManualInput>({
    practiceName: "",
    physicians: 10,
    annualRevenue: 8000000,
    monthlyClaimsVolume: 5000,
    currentDenialRate: 12,
    averageDaysInAR: 45,
    numberOfBillers: 4,
    specialty: "Multi-Specialty",
  });

  // ── Handle CSV file ──────────────────────────────────
  const handleFile = useCallback((file: File) => {
    setParseError("");
    setFileName(file.name);

    if (!file.name.match(/\.(csv|txt)$/i)) {
      setParseError("Please upload a CSV file (.csv or .txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const claims = parseCSV(text);
        if (claims.length < 5) {
          setParseError("File must contain at least 5 claim records. Download our sample CSV for the correct format.");
          return;
        }
        runAnalysis(() => analyzeCSVClaims(claims));
      } catch {
        setParseError("Error parsing file. Please check the format and try again.");
      }
    };
    reader.readAsText(file);
  }, []);

  // ── Drag & drop handlers ─────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);
  const onDragLeave = useCallback(() => setDragActive(false), []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ── Analysis runner with stages ──────────────────────
  const runAnalysis = useCallback((analyzeFn: () => AuditResults) => {
    setStep("analyzing");
    setAnalysisProgress(0);

    const stages = [
      { label: "Parsing claims data...", pct: 15 },
      { label: "Identifying denial patterns...", pct: 35 },
      { label: "Calculating revenue leakage...", pct: 55 },
      { label: "Benchmarking against industry...", pct: 75 },
      { label: "Generating recommendations...", pct: 90 },
      { label: "Building your report...", pct: 100 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setAnalysisStage(stages[i].label);
        setAnalysisProgress(stages[i].pct);
        i++;
      } else {
        clearInterval(interval);
        const res = analyzeFn();
        setResults(res);
        setStep("results");
      }
    }, 600);
  }, []);

  // ── Manual form submit ───────────────────────────────
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(() => analyzeManualInput(manual));
  };

  // ── Download sample CSV ──────────────────────────────
  const downloadSampleCSV = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "riveo-sample-claims.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Print report ─────────────────────────────────────
  const printReport = () => window.print();

  /* ═════════════════════════════════════════════════════
     RENDER: STEP 1 — CHOOSE METHOD
     ═════════════════════════════════════════════════════ */
  const renderChoose = () => (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          <AlertTriangle className="w-4 h-4" />
          Your practice is likely losing $78K-$500K+ per year to revenue leakage
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Free Revenue <span className="gradient-text">Leakage Audit</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          See exactly where your revenue is leaking — denied claims, undercoding, underpayments,
          and more. Get a personalized report in under 60 seconds.
        </p>
      </div>

      {/* Two options */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
        {/* CSV Upload */}
        <button
          data-testid="upload-card"
          onClick={() => setStep("upload")}
          className="group text-left p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Upload Claims Data</h3>
          <p className="text-slate-400 mb-4">
            Upload a CSV of your claims for the most accurate analysis. We&apos;ll analyze denial patterns, payer performance, and revenue leakage from your actual data.
          </p>
          <div className="flex items-center gap-2 text-primary-light group-hover:text-accent transition-colors">
            Most accurate analysis <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Manual Entry */}
        <button
          data-testid="manual-card"
          onClick={() => setStep("manual")}
          className="group text-left p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Assessment</h3>
          <p className="text-slate-400 mb-4">
            Enter your practice details and key metrics. We&apos;ll generate a leakage estimate using industry benchmarks matched to your specialty and size.
          </p>
          <div className="flex items-center gap-2 text-accent group-hover:text-primary-light transition-colors">
            Takes 2 minutes <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Trust signals */}
      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" /> HIPAA Compliant
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-500" /> AES-256 Encrypted
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" /> Results in 60 Seconds
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" /> 100% Free, No Commitment
        </div>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     RENDER: STEP 2a — CSV UPLOAD
     ═════════════════════════════════════════════════════ */
  const renderUpload = () => (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep("choose")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Upload Claims Data</h2>
        <p className="text-slate-400 mb-8">
          Upload a CSV file with your claims data. We accept most billing system exports.
        </p>

        {/* Drag & drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-white/20 bg-white/5 hover:border-white/40"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <FileSpreadsheet className={`w-12 h-12 mx-auto mb-4 ${dragActive ? "text-primary" : "text-slate-500"}`} />
          <p className="text-white font-medium mb-2">
            {fileName || "Drag & drop your CSV file here"}
          </p>
          <p className="text-slate-500 text-sm">or click to browse — CSV format, up to 50MB</p>
        </div>

        {/* Error message */}
        {parseError && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{parseError}</p>
          </div>
        )}

        {/* Expected format */}
        <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" /> Expected CSV columns
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-400">
            {["claim_id", "patient_id", "date_of_service", "payer", "cpt_code", "icd_code",
              "billed_amount", "paid_amount", "status", "denial_code", "denial_reason", "date_submitted"
            ].map((col) => (
              <code key={col} className="bg-white/5 px-2 py-1 rounded text-xs">{col}</code>
            ))}
          </div>
          <button
            onClick={downloadSampleCSV}
            className="mt-4 flex items-center gap-2 text-sm text-primary-light hover:text-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Download sample CSV
          </button>
        </div>

        {/* Privacy note */}
        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
          <Shield className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
          <p>Your data is analyzed entirely in your browser. Nothing is sent to our servers or stored. HIPAA-safe by design.</p>
        </div>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     RENDER: STEP 2b — MANUAL ENTRY
     ═════════════════════════════════════════════════════ */
  const renderManual = () => (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep("choose")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Quick Assessment</h2>
        <p className="text-slate-400 mb-8">
          Enter your practice details. We&apos;ll estimate your revenue leakage using industry benchmarks for your specialty and size.
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-6">
          {/* Practice Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Practice / Organization Name</label>
            <input
              type="text"
              required
              value={manual.practiceName}
              onChange={(e) => setManual({ ...manual, practiceName: e.target.value })}
              placeholder="e.g., Central Valley Medical Group"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Two-col grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Physicians</label>
              <input
                type="number"
                required
                min={1}
                max={500}
                value={manual.physicians}
                onChange={(e) => setManual({ ...manual, physicians: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
              <select
                value={manual.specialty}
                onChange={(e) => setManual({ ...manual, specialty: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary appearance-none"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Annual Revenue ($)</label>
              <input
                type="number"
                required
                min={100000}
                value={manual.annualRevenue}
                onChange={(e) => setManual({ ...manual, annualRevenue: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-slate-500 mt-1">Net collections or gross charges</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Claims Volume</label>
              <input
                type="number"
                required
                min={50}
                value={manual.monthlyClaimsVolume}
                onChange={(e) => setManual({ ...manual, monthlyClaimsVolume: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Denial Rate (%)</label>
              <input
                type="number"
                required
                min={0}
                max={50}
                step={0.1}
                value={manual.currentDenialRate}
                onChange={(e) => setManual({ ...manual, currentDenialRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-slate-500 mt-1">Industry average: 10-15%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Average Days in A/R</label>
              <input
                type="number"
                required
                min={10}
                max={120}
                value={manual.averageDaysInAR}
                onChange={(e) => setManual({ ...manual, averageDaysInAR: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-slate-500 mt-1">Industry average: 45 days</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Billing Staff</label>
            <input
              type="number"
              required
              min={0}
              max={200}
              value={manual.numberOfBillers}
              onChange={(e) => setManual({ ...manual, numberOfBillers: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Analyze My Revenue <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-slate-500 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            No data is stored. Analysis runs instantly. 100% free.
          </p>
        </form>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     RENDER: STEP 3 — ANALYZING
     ═════════════════════════════════════════════════════ */
  const renderAnalyzing = () => (
    <section className="py-32 px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Animated pulse */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full gradient-bg animate-pulse-glow flex items-center justify-center">
          <Activity className="w-12 h-12 text-white animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Revenue</h2>
        <p className="text-slate-400 mb-8">{analysisStage}</p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-4">
          <div
            className="h-full rounded-full gradient-bg transition-all duration-500"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
        <p className="text-sm text-slate-500">{analysisProgress}% complete</p>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     RENDER: STEP 4 — RESULTS
     ═════════════════════════════════════════════════════ */
  const renderResults = () => {
    if (!results) return null;
    const r = results;

    return (
      <section className="py-16 px-4 print:py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
            <div>
              <p className="text-sm text-slate-400 mb-1">Riveo Health — Free Revenue Audit</p>
              <h2 className="text-3xl font-bold text-white">Your Revenue Leakage Report</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={printReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all text-sm"
              >
                <Printer className="w-4 h-4" /> Print Report
              </button>
              <Link
                href="/demo"
                className="flex items-center gap-2 px-6 py-2 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity text-sm"
              >
                <Phone className="w-4 h-4" /> Discuss Results
              </Link>
            </div>
          </div>

          {/* ── EXECUTIVE SUMMARY ──────────────────────── */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Revenue Leakage Detected</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Annual Leakage Found</p>
                <p className="text-3xl md:text-4xl font-bold text-red-400">{fmt$(r.totalLeakageFound)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Recovery Potential</p>
                <p className="text-3xl md:text-4xl font-bold text-green-400">{fmt$(r.annualRecoveryPotential)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Current Denial Rate</p>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">{fmtPct(r.currentDenialRate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">ROI with Riveo</p>
                <p className="text-3xl md:text-4xl font-bold text-primary-light">{r.roiMultiple}x</p>
              </div>
            </div>
          </div>

          {/* ── SUMMARY CARDS ─────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary-light" />
                <h4 className="font-semibold text-white">Claims Analyzed</h4>
              </div>
              <p className="text-2xl font-bold text-white">{fmtNum(r.totalClaimsAnalyzed)}</p>
              <p className="text-sm text-slate-400">Total billed: {fmt$(r.totalBilledAmount)}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-amber-400" />
                <h4 className="font-semibold text-white">Denial Rate vs Benchmark</h4>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-xs text-slate-500">You</p>
                  <p className="text-2xl font-bold text-amber-400">{fmtPct(r.currentDenialRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Industry Avg</p>
                  <p className="text-lg text-slate-400">{fmtPct(r.industryAvgDenialRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Best-in-Class</p>
                  <p className="text-lg text-green-400">{fmtPct(r.bestInClassDenialRate)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-white">Days in A/R</h4>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-xs text-slate-500">You</p>
                  <p className="text-2xl font-bold text-white">{r.currentDaysInAR} days</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Industry Avg</p>
                  <p className="text-lg text-slate-400">{r.industryAvgDaysInAR} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── DENIAL BREAKDOWN ──────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-primary-light" />
              <h3 className="text-xl font-bold text-white">Denial Breakdown by Reason</h3>
            </div>

            <div className="space-y-4">
              {r.denialBreakdown.map((d, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 w-12">{d.code}</span>
                      <span className="text-sm text-slate-300">{d.reason}</span>
                      {d.recoverable ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Recoverable</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Lost</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-white">{fmt$(d.amount)}</span>
                      <span className="text-xs text-slate-500 ml-2">({fmtPct(d.percentage)})</span>
                    </div>
                  </div>
                  <Bar
                    value={d.percentage}
                    max={r.denialBreakdown[0]?.percentage || 1}
                    color={d.recoverable ? "bg-gradient-to-r from-primary to-accent" : "bg-red-500/60"}
                  />
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Source: CARC (Claim Adjustment Reason Codes). Industry distribution benchmarks from AAPC, HFMA, and MGMA.
            </p>
          </div>

          {/* ── LEAKAGE SOURCES & PAYER PERFORMANCE ──── */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Leakage sources */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-white">Where You&apos;re Losing Money</h3>
              </div>

              <div className="space-y-4">
                {r.leakageSources.map((l, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">{l.source}</span>
                      <span className="text-sm font-bold text-red-400">{fmt$(l.annualAmount)}/yr</span>
                    </div>
                    <p className="text-xs text-slate-500">{l.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payer performance */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-white">Payer Performance</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs">
                      <th className="text-left pb-3">Payer</th>
                      <th className="text-right pb-3">Denial Rate</th>
                      <th className="text-right pb-3">Avg Days</th>
                      <th className="text-right pb-3">Underpaid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.payerPerformance.map((p, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3 text-slate-300">{p.name}</td>
                        <td className={`py-3 text-right font-medium ${p.denialRate > 0.15 ? "text-red-400" : p.denialRate > 0.10 ? "text-amber-400" : "text-green-400"}`}>
                          {fmtPct(p.denialRate)}
                        </td>
                        <td className={`py-3 text-right ${p.avgDaysToPayment > 45 ? "text-amber-400" : "text-slate-300"}`}>
                          {p.avgDaysToPayment}
                        </td>
                        <td className={`py-3 text-right ${p.underpaymentRate > 0.03 ? "text-red-400" : "text-slate-300"}`}>
                          {fmtPct(p.underpaymentRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── ROI WITH RIVEO ────────────────────────── */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-light" />
              <h3 className="text-xl font-bold text-white">ROI Projection with Riveo Health</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Current state */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Current State</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual cost of denials</span>
                    <span className="text-white font-medium">{fmt$(r.currentAnnualCostOfDenials)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total revenue leakage</span>
                    <span className="text-red-400 font-medium">{fmt$(r.totalLeakageFound)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Denial rate</span>
                    <span className="text-amber-400 font-medium">{fmtPct(r.currentDenialRate)}</span>
                  </div>
                </div>
              </div>

              {/* With Riveo */}
              <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
                <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">With Riveo Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual recovery</span>
                    <span className="text-green-400 font-bold">{fmt$(r.projectedSavingsWithRiveo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Riveo monthly cost</span>
                    <span className="text-white font-medium">{fmt$(r.riveoMonthlyCost)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Projected denial rate</span>
                    <span className="text-green-400 font-medium">{fmtPct(r.projectedDenialRate)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                    <span className="text-white font-semibold">Net annual ROI</span>
                    <span className="text-green-400 font-bold text-lg">{r.roiMultiple}x return</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payback period</span>
                    <span className="text-accent font-medium">{r.paybackDays} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RECOMMENDATIONS ───────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-bold text-white">Prioritized Recommendations</h3>
            </div>

            <div className="space-y-4">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          rec.priority === "critical"
                            ? "bg-red-500/10 text-red-400"
                            : rec.priority === "high"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                    </div>
                    <span className="text-green-400 font-semibold text-sm whitespace-nowrap">
                      +{fmt$(rec.potentialSavings)}/yr
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" /> {rec.implementation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── METHODOLOGY NOTE ──────────────────────── */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-8 text-sm text-slate-500">
            <p className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="font-medium text-slate-400">Methodology & Sources</span>
            </p>
            <p>
              This analysis uses industry benchmarks from MGMA, AAPC, HFMA, AMA, and HBMA. Denial distributions
              are based on national claims data patterns. Actual results may vary based on specialty, payer mix,
              and operational factors. For a deeper analysis with your actual claims data, schedule a call with our team.
            </p>
          </div>

          {/* ── FINAL CTA ─────────────────────────────── */}
          <div className="rounded-2xl gradient-bg p-10 text-center print:hidden">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Recover {fmt$(r.annualRecoveryPotential)} Per Year?
            </h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Our team will walk you through these findings, show you Riveo Health in action,
              and build a custom implementation plan. No contracts — month-to-month.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" /> Book a Call to Discuss
              </Link>
              <button
                onClick={() => { setStep("choose"); setResults(null); }}
                className="px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Run Another Audit
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* ═════════════════════════════════════════════════════
     PAGE LAYOUT
     ═════════════════════════════════════════════════════ */
  return (
    <main className="bg-surface-darker min-h-screen text-white">
      <Navbar />

      {step === "choose" && renderChoose()}
      {step === "upload" && renderUpload()}
      {step === "manual" && renderManual()}
      {step === "analyzing" && renderAnalyzing()}
      {step === "results" && renderResults()}

      <Footer />
    </main>
  );
}
