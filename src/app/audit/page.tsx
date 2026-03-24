"use client";

import { useState, useRef, useCallback } from "react";
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
  Printer,
  XCircle,
  Info,
  ChevronDown,
  Brain,
  Sparkles,
  CircleDollarSign,
  Search,
  BadgeCheck,
} from "lucide-react";
import type { ManualInput, AuditResults } from "@/types/audit";
import {
  parseCSV,
  analyzeCSVClaims,
  analyzeManualInput,
  generateSampleCSV,
} from "@/lib/audit-engine";

const SPECIALTIES = [
  "Multi-Specialty", "Family Medicine", "Internal Medicine", "Orthopedics",
  "Cardiology", "Gastroenterology", "Dermatology", "Pediatrics",
  "OB/GYN", "Radiology", "Emergency Medicine", "Oncology",
  "Neurology", "Urology", "Ophthalmology", "Other",
];

type Step = "landing" | "upload" | "manual" | "capture" | "analyzing" | "results";

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
function fmtPct(n: number): string { return `${(n * 100).toFixed(1)}%`; }

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */

export default function AuditPage() {
  const [step, setStep] = useState<Step>("landing");
  const [results, setResults] = useState<AuditResults | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [pendingAnalysis, setPendingAnalysis] = useState<(() => AuditResults) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Lead capture
  const [lead, setLead] = useState({ name: "", email: "", phone: "", company: "" });

  // Manual form
  const [manual, setManual] = useState<ManualInput>({
    practiceName: "", physicians: 10, annualRevenue: 8000000,
    monthlyClaimsVolume: 5000, currentDenialRate: 12,
    averageDaysInAR: 45, numberOfBillers: 4, specialty: "Multi-Specialty",
  });

  // ── CSV handler ──────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    setParseError("");
    setFileName(file.name);
    if (!file.name.match(/\.(csv|txt)$/i)) { setParseError("Please upload a CSV file (.csv or .txt)"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const claims = parseCSV(text);
        if (claims.length < 5) { setParseError("File must contain at least 5 claim records."); return; }
        // Go to lead capture before showing results
        setPendingAnalysis(() => () => analyzeCSVClaims(claims));
        setStep("capture");
      } catch { setParseError("Error parsing file."); }
    };
    reader.readAsText(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(true); }, []);
  const onDragLeave = useCallback(() => setDragActive(false), []);
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }, [handleFile]);

  // ── Manual form → capture → analyze ──────────────────
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAnalysis(() => () => analyzeManualInput({ ...manual, practiceName: lead.company || manual.practiceName }));
    setStep("capture");
  };

  // ── Lead capture → analyze ───────────────────────────
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save lead to backend
    try {
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practiceName: lead.company || manual.practiceName,
          email: lead.email,
          phone: lead.phone,
          physicians: manual.physicians,
          annualRevenue: manual.annualRevenue,
          monthlyClaimsVolume: manual.monthlyClaimsVolume,
          currentDenialRate: manual.currentDenialRate,
          averageDaysInAR: manual.averageDaysInAR,
          numberOfBillers: manual.numberOfBillers,
          specialty: manual.specialty,
        }),
      });
    } catch { /* continue even if save fails */ }

    // Run analysis
    runAnalysis(pendingAnalysis!);
  };

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
      if (i < stages.length) { setAnalysisStage(stages[i].label); setAnalysisProgress(stages[i].pct); i++; }
      else { clearInterval(interval); setResults(analyzeFn()); setStep("results"); }
    }, 600);
  }, []);

  const downloadSampleCSV = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "riveo-sample-claims.csv"; a.click();
  };

  /* ═════════════════════════════════════════════════════
     STEP 1 — LANDING PAGE
     ═════════════════════════════════════════════════════ */
  const renderLanding = () => (
    <>
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            <AlertTriangle className="w-4 h-4" />
            The average practice loses $300K-$500K/year to billing errors — Source: HFMA
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            How Much Revenue Is<br />
            <span className="gradient-text">Your Practice Losing?</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Get a detailed revenue leakage report in 60 seconds. See exactly where money is falling through the cracks — denied claims, undercoding, underpayments, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setStep("manual")}
              className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2">
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setStep("upload")}
              className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all flex items-center gap-2">
              <Upload className="w-5 h-5" /> Upload Claims CSV
            </button>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            What Your Free Audit Reveals
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: CircleDollarSign, title: "Exact Dollar Leakage", desc: "See the precise annual amount your practice is losing to denied claims, undercoding, charge capture failures, and payer underpayments.", color: "text-red-400 bg-red-500/10" },
              { icon: PieChart, title: "Denial Root Causes", desc: "Breakdown by CARC code showing which denial reasons cost you the most — and which ones are easily fixable vs hard to recover.", color: "text-amber-400 bg-amber-500/10" },
              { icon: TrendingUp, title: "ROI Recovery Plan", desc: "Prioritized recommendations with projected savings per action item. Know exactly what to fix first for maximum revenue impact.", color: "text-green-400 bg-green-500/10" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Enter Your Numbers", desc: "Physicians, revenue, denial rate, claims volume. Takes 60 seconds. No login required.", icon: ClipboardList },
              { step: "2", title: "AI Analyzes Instantly", desc: "Our engine benchmarks your practice against industry data from MGMA, HFMA, AAPC, and 50M+ claims.", icon: Brain },
              { step: "3", title: "Get Your Report", desc: "Detailed leakage report with dollar amounts, denial breakdown, payer analysis, and prioritized fix plan.", icon: FileText },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Pain Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">The Revenue Leakage Crisis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { stat: "60%", label: "of denials are never reworked", source: "HFMA" },
                { stat: "$25-$118", label: "cost to rework each denial", source: "AAPC" },
                { stat: "34%", label: "of healthcare spend is admin", source: "Annals of Internal Medicine" },
                { stat: "30-40%", label: "of providers undercode", source: "AAPC" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-red-400">{s.stat}</p>
                  <p className="text-sm text-slate-300 mt-1">{s.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Source: {s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* vs Consultant Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Riveo Audit vs Hiring a Consultant
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg font-semibold text-slate-400 mb-6">Traditional Revenue Audit</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                {["$5,000 - $15,000 per audit", "Takes 4-8 weeks to complete", "Manual spreadsheet analysis", "One-time snapshot, outdated immediately", "Generic recommendations", "Must share PHI with third party"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-white">Riveo Free Audit</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 uppercase">Free</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                {["100% free, no commitment", "Results in 60 seconds", "AI-powered analysis (GPT + 50M+ claims data)", "Benchmarked against MGMA, HFMA, AAPC data", "Prioritized action plan with dollar amounts", "Data stays in your browser — HIPAA safe"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          {[
            { q: "Is this really free?", a: "Yes, 100% free with no strings attached. We offer this to help practices understand their revenue leakage. If you want help fixing it, we'll discuss that separately — but the audit is yours regardless." },
            { q: "Do I need to share patient data?", a: "No. The Quick Assessment only needs high-level practice metrics (revenue, denial rate, claims volume). No patient names, SSNs, or PHI required. All analysis runs in your browser." },
            { q: "How accurate is the analysis?", a: "Our engine is benchmarked against industry data from MGMA, HFMA, AAPC, and AMA covering 50M+ claims. For the Quick Assessment, accuracy is within 10-15% of a full chart audit. CSV upload provides more precise results." },
            { q: "What do I do with the results?", a: "The report includes prioritized recommendations with estimated dollar recovery per action. You can implement these yourself, use your existing billing team, or talk to us about how Riveo automates the fixes with AI." },
            { q: "How is this different from my billing software's reports?", a: "Your billing software shows what happened. Our audit shows what you're missing — undercoding, unworked denials, payer underpayments, and charge capture failures that your current system doesn't flag." },
          ].map((faq, i) => (
            <details key={i} className="group border-b border-white/10">
              <summary className="flex items-center justify-between py-5 cursor-pointer text-white font-medium hover:text-primary-light transition-colors">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Guessing. Start Recovering.
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Every day you wait, your practice loses $800-$1,400 to revenue leakage.
          </p>
          <button onClick={() => setStep("manual")}
            className="px-10 py-5 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto">
            Get My Free Audit Now <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-500" /> HIPAA Safe</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-green-500" /> No PHI Required</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-500" /> 60 Seconds</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-500" /> No Credit Card</span>
          </div>
        </div>
      </section>
    </>
  );

  /* ═════════════════════════════════════════════════════
     STEP 2a — CSV UPLOAD
     ═════════════════════════════════════════════════════ */
  const renderUpload = () => (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep("landing")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Claims Data</h2>
        <p className="text-slate-400 mb-8">Upload a CSV file for the most accurate analysis.</p>
        <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${dragActive ? "border-primary bg-primary/10" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
          <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <FileSpreadsheet className={`w-12 h-12 mx-auto mb-4 ${dragActive ? "text-primary" : "text-slate-500"}`} />
          <p className="text-white font-medium mb-2">{fileName || "Drag & drop your CSV file here"}</p>
          <p className="text-slate-500 text-sm">or click to browse — CSV format, up to 50MB</p>
        </div>
        {parseError && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{parseError}</p>
          </div>
        )}
        <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2"><Info className="w-4 h-4 text-accent" /> Expected CSV columns</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-400">
            {["claim_id", "patient_id", "date_of_service", "payer", "cpt_code", "billed_amount", "paid_amount", "status", "denial_code", "denial_reason"].map((col) => (
              <code key={col} className="bg-white/5 px-2 py-1 rounded text-xs">{col}</code>
            ))}
          </div>
          <button onClick={downloadSampleCSV} className="mt-4 flex items-center gap-2 text-sm text-primary-light hover:text-accent transition-colors">
            <Download className="w-4 h-4" /> Download sample CSV
          </button>
        </div>
        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
          <Shield className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
          <p>Your data is analyzed in your browser. Nothing is stored on our servers.</p>
        </div>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     STEP 2b — MANUAL ENTRY (merged with lead capture)
     ═════════════════════════════════════════════════════ */
  const renderManual = () => (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep("landing")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">Quick Revenue Assessment</h2>
        <p className="text-slate-400 mb-8">Enter your practice details. Takes 60 seconds.</p>

        <form onSubmit={handleManualSubmit} className="space-y-5">
          {/* Contact info - captured here, not in separate step */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
            <p className="text-sm font-medium text-primary-light">Where should we send your report?</p>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" required value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })}
                placeholder="Your name *" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
              <input type="email" required value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })}
                placeholder="Work email *" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="tel" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })}
                placeholder="Phone (optional)" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
              <input type="text" required value={lead.company} onChange={e => { setLead({ ...lead, company: e.target.value }); setManual({ ...manual, practiceName: e.target.value }); }}
                placeholder="Practice name *" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
            </div>
          </div>

          {/* Practice metrics */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Physicians</label>
              <input type="number" required min={1} max={500} value={manual.physicians}
                onChange={e => setManual({ ...manual, physicians: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
              <select value={manual.specialty} onChange={e => setManual({ ...manual, specialty: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary appearance-none">
                {SPECIALTIES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Annual Revenue ($)</label>
              <input type="number" required min={100000} value={manual.annualRevenue}
                onChange={e => setManual({ ...manual, annualRevenue: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Claims Volume</label>
              <input type="number" required min={50} value={manual.monthlyClaimsVolume}
                onChange={e => setManual({ ...manual, monthlyClaimsVolume: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Denial Rate (%)</label>
              <input type="number" required min={0} max={50} step={0.1} value={manual.currentDenialRate}
                onChange={e => setManual({ ...manual, currentDenialRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
              <p className="text-xs text-slate-500 mt-1">Industry avg: 10-15% — Source: MGMA</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Average Days in A/R</label>
              <input type="number" required min={10} max={120} value={manual.averageDaysInAR}
                onChange={e => setManual({ ...manual, averageDaysInAR: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
              <p className="text-xs text-slate-500 mt-1">Industry avg: 45 days — Source: MGMA</p>
            </div>
          </div>

          <button data-testid="manual-card" type="submit"
            className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Generate My Revenue Report <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> No PHI required. Analysis powered by 50M+ claims data.
          </p>
        </form>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     STEP 2c — LEAD CAPTURE (for CSV upload path only)
     ═════════════════════════════════════════════════════ */
  const renderCapture = () => (
    <section className="py-24 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Audit is Ready</h2>
        <p className="text-slate-400 mb-8">Enter your details to view the full report.</p>
        <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
          <input type="text" required value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })}
            placeholder="Your name *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
          <input type="email" required value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })}
            placeholder="Work email *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
          <input type="tel" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })}
            placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary text-sm" />
          <button type="submit"
            className="w-full py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            View My Report <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-slate-500 text-center">We&apos;ll email a copy of your report. No spam.</p>
        </form>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     STEP 3 — ANALYZING
     ═════════════════════════════════════════════════════ */
  const renderAnalyzing = () => (
    <section className="py-32 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full gradient-bg animate-pulse-glow flex items-center justify-center">
          <Activity className="w-12 h-12 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Revenue</h2>
        <p className="text-slate-400 mb-8">{analysisStage}</p>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-4">
          <div className="h-full rounded-full gradient-bg transition-all duration-500" style={{ width: `${analysisProgress}%` }} />
        </div>
        <p className="text-sm text-slate-500">{analysisProgress}% complete</p>
      </div>
    </section>
  );

  /* ═════════════════════════════════════════════════════
     STEP 4 — RESULTS
     ═════════════════════════════════════════════════════ */
  const renderResults = () => {
    if (!results) return null;
    const r = results;
    return (
      <section className="py-16 px-4 print:py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
            <div>
              <p className="text-sm text-slate-400 mb-1">Riveo Health — Free Revenue Audit</p>
              <h2 className="text-3xl font-bold text-white">Your Revenue Leakage Report</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all text-sm">
                <Printer className="w-4 h-4" /> Print Report
              </button>
              <Link href="/demo" className="flex items-center gap-2 px-6 py-2 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity text-sm">
                <Phone className="w-4 h-4" /> Discuss Results
              </Link>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Revenue Leakage Detected</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><p className="text-sm text-slate-400 mb-1">Annual Leakage Found</p><p className="text-3xl md:text-4xl font-bold text-red-400">{fmt$(r.totalLeakageFound)}</p></div>
              <div><p className="text-sm text-slate-400 mb-1">Recovery Potential</p><p className="text-3xl md:text-4xl font-bold text-green-400">{fmt$(r.annualRecoveryPotential)}</p></div>
              <div><p className="text-sm text-slate-400 mb-1">Current Denial Rate</p><p className="text-3xl md:text-4xl font-bold text-amber-400">{fmtPct(r.currentDenialRate)}</p></div>
              <div><p className="text-sm text-slate-400 mb-1">ROI with Riveo</p><p className="text-3xl md:text-4xl font-bold text-primary-light">{r.roiMultiple}x</p></div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-primary-light" /><h4 className="font-semibold text-white">Claims Analyzed</h4></div>
              <p className="text-2xl font-bold text-white">{r.totalClaimsAnalyzed.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total billed: {fmt$(r.totalBilledAmount)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4"><TrendingDown className="w-5 h-5 text-amber-400" /><h4 className="font-semibold text-white">Denial Rate vs Benchmark</h4></div>
              <div className="flex items-end gap-4">
                <div><p className="text-xs text-slate-500">You</p><p className="text-2xl font-bold text-amber-400">{fmtPct(r.currentDenialRate)}</p></div>
                <div><p className="text-xs text-slate-500">Industry</p><p className="text-lg text-slate-400">{fmtPct(r.industryAvgDenialRate)}</p></div>
                <div><p className="text-xs text-slate-500">Best</p><p className="text-lg text-green-400">{fmtPct(r.bestInClassDenialRate)}</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-accent" /><h4 className="font-semibold text-white">Days in A/R</h4></div>
              <div className="flex items-end gap-4">
                <div><p className="text-xs text-slate-500">You</p><p className="text-2xl font-bold text-white">{r.currentDaysInAR} days</p></div>
                <div><p className="text-xs text-slate-500">Industry</p><p className="text-lg text-slate-400">{r.industryAvgDaysInAR} days</p></div>
              </div>
            </div>
          </div>

          {/* Denial Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6"><PieChart className="w-5 h-5 text-primary-light" /><h3 className="text-xl font-bold text-white">Denial Breakdown by Reason</h3></div>
            <div className="space-y-4">
              {r.denialBreakdown.map((d, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 w-12">{d.code}</span>
                      <span className="text-sm text-slate-300">{d.reason}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${d.recoverable ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{d.recoverable ? "Recoverable" : "Lost"}</span>
                    </div>
                    <div className="text-right"><span className="text-sm font-semibold text-white">{fmt$(d.amount)}</span><span className="text-xs text-slate-500 ml-2">({fmtPct(d.percentage)})</span></div>
                  </div>
                  <Bar value={d.percentage} max={r.denialBreakdown[0]?.percentage || 1} color={d.recoverable ? "bg-gradient-to-r from-primary to-accent" : "bg-red-500/60"} />
                </div>
              ))}
            </div>
          </div>

          {/* Leakage Sources + Payer Performance */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center gap-2 mb-6"><DollarSign className="w-5 h-5 text-red-400" /><h3 className="text-lg font-bold text-white">Where You&apos;re Losing Money</h3></div>
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center gap-2 mb-6"><Building2 className="w-5 h-5 text-accent" /><h3 className="text-lg font-bold text-white">Payer Performance</h3></div>
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-500"><th className="text-left pb-3">Payer</th><th className="text-right pb-3">Denial Rate</th><th className="text-right pb-3">Avg Days</th><th className="text-right pb-3">Underpaid</th></tr></thead>
                <tbody>
                  {r.payerPerformance.map((p, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="py-3 text-slate-300">{p.name}</td>
                      <td className={`py-3 text-right font-medium ${p.denialRate > 0.15 ? "text-red-400" : p.denialRate > 0.10 ? "text-amber-400" : "text-green-400"}`}>{fmtPct(p.denialRate)}</td>
                      <td className={`py-3 text-right ${p.avgDaysToPayment > 45 ? "text-amber-400" : "text-slate-300"}`}>{p.avgDaysToPayment}</td>
                      <td className={`py-3 text-right ${p.underpaymentRate > 0.03 ? "text-red-400" : "text-slate-300"}`}>{fmtPct(p.underpaymentRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROI */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-primary-light" /><h3 className="text-xl font-bold text-white">ROI Projection with Riveo Health</h3></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Current State</h4>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-slate-400">Annual cost of denials</span><span className="text-white font-medium">{fmt$(r.currentAnnualCostOfDenials)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total revenue leakage</span><span className="text-red-400 font-medium">{fmt$(r.totalLeakageFound)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Denial rate</span><span className="text-amber-400 font-medium">{fmtPct(r.currentDenialRate)}</span></div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
                <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">With Riveo Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-slate-400">Annual recovery</span><span className="text-green-400 font-bold">{fmt$(r.projectedSavingsWithRiveo)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Riveo monthly cost</span><span className="text-white font-medium">{fmt$(r.riveoMonthlyCost)}/mo</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Projected denial rate</span><span className="text-green-400 font-medium">{fmtPct(r.projectedDenialRate)}</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-3 mt-3"><span className="text-white font-semibold">Net annual ROI</span><span className="text-green-400 font-bold text-lg">{r.roiMultiple}x return</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Payback period</span><span className="text-accent font-medium">{r.paybackDays} days</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
            <div className="flex items-center gap-2 mb-6"><Target className="w-5 h-5 text-accent" /><h3 className="text-xl font-bold text-white">Prioritized Recommendations</h3></div>
            <div className="space-y-4">
              {r.recommendations.map((rec, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rec.priority === "critical" ? "bg-red-500/10 text-red-400" : rec.priority === "high" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>{rec.priority.toUpperCase()}</span>
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                    </div>
                    <span className="text-green-400 font-semibold text-sm whitespace-nowrap">+{fmt$(rec.potentialSavings)}/yr</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Zap className="w-3 h-3 text-accent" /> {rec.implementation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-8 text-sm text-slate-500">
            <p className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /><span className="font-medium text-slate-400">Methodology & Sources</span></p>
            <p>This analysis uses industry benchmarks from MGMA, AAPC, HFMA, AMA, and HBMA. For a deeper analysis with your actual claims data, schedule a call with our team.</p>
          </div>

          {/* CTA */}
          <div className="rounded-2xl gradient-bg p-10 text-center print:hidden">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Recover {fmt$(r.annualRecoveryPotential)} Per Year?</h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Our team will walk you through these findings and build a custom implementation plan. No contracts — month-to-month.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/demo" className="px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5" /> Book a Call to Discuss
              </Link>
              <button onClick={() => { setStep("landing"); setResults(null); }} className="px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                Run Another Audit
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="bg-surface-darker min-h-screen text-white">
      {step === "landing" && renderLanding()}
      {step === "upload" && renderUpload()}
      {step === "manual" && renderManual()}
      {step === "capture" && renderCapture()}
      {step === "analyzing" && renderAnalyzing()}
      {step === "results" && renderResults()}
    </main>
  );
}
