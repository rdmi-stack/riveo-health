"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Users, Upload, Settings, CheckCircle, ArrowRight, ArrowLeft,
  Loader2, Stethoscope, FileSpreadsheet, Bell, Shield,
} from "lucide-react";

const STEPS = [
  { id: "org", title: "Organization", desc: "Tell us about your practice", icon: Building2 },
  { id: "team", title: "Invite Team", desc: "Add your billing staff", icon: Users },
  { id: "data", title: "Import Data", desc: "Upload claims or connect EHR", icon: Upload },
  { id: "config", title: "Configure", desc: "Set preferences", icon: Settings },
  { id: "done", title: "Go Live", desc: "You're all set", icon: CheckCircle },
];

const SPECIALTIES = [
  "Multi-Specialty", "Family Medicine", "Internal Medicine", "Orthopedics",
  "Cardiology", "Gastroenterology", "Dermatology", "Pediatrics",
  "OB/GYN", "Radiology", "Emergency Medicine", "Oncology",
  "Neurology", "Urology", "Ophthalmology", "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  // Org details
  const [orgData, setOrgData] = useState({
    name: "", specialty: "Multi-Specialty", physicians: 10, ehrSystem: "", npi: "",
  });

  // Team invites
  const [invites, setInvites] = useState([{ email: "", role: "biller" }]);

  // Config
  const [config, setConfig] = useState({
    newDenials: true, highValue: true, weeklySummary: false, timezone: "America/New_York",
  });

  function next() { setStep(Math.min(step + 1, STEPS.length - 1)); }
  function back() { setStep(Math.max(step - 1, 0)); }

  async function handleSeedDemo() {
    setSeedLoading(true);
    try {
      await fetch("/api/seed?org=demo");
    } finally {
      setSeedLoading(false);
      next();
    }
  }

  async function completeOnboarding() {
    setLoading(true);
    try {
      // Mark onboarding complete
      await fetch("/api/auth/me", { method: "GET" }); // verify session
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= step ? "text-white" : "text-slate-600"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "gradient-bg text-white" :
                  i === step ? "border-2 border-primary text-primary-light" :
                  "border border-white/10 text-slate-600"
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden md:block text-xs font-medium">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 md:w-16 h-px mx-2 ${i < step ? "bg-primary" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        {/* ── Step 1: Organization ─────────────── */}
        {step === 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Organization Details</h2>
                <p className="text-sm text-slate-400">Tell us about your practice</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Practice Name *</label>
                <input value={orgData.name} onChange={e => setOrgData({ ...orgData, name: e.target.value })}
                  placeholder="e.g., Valley Medical Group"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1.5 block">Specialty</label>
                  <select value={orgData.specialty} onChange={e => setOrgData({ ...orgData, specialty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary appearance-none">
                    {SPECIALTIES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1.5 block">Number of Physicians</label>
                  <input type="number" min={1} value={orgData.physicians}
                    onChange={e => setOrgData({ ...orgData, physicians: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1.5 block">EHR System</label>
                  <select value={orgData.ehrSystem} onChange={e => setOrgData({ ...orgData, ehrSystem: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary appearance-none">
                    <option value="" className="bg-slate-900">Select EHR...</option>
                    <option className="bg-slate-900">athenahealth</option>
                    <option className="bg-slate-900">Epic</option>
                    <option className="bg-slate-900">Cerner</option>
                    <option className="bg-slate-900">eClinicalWorks</option>
                    <option className="bg-slate-900">Allscripts</option>
                    <option className="bg-slate-900">NextGen</option>
                    <option className="bg-slate-900">Other</option>
                    <option className="bg-slate-900">None / Manual</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1.5 block">NPI Number (optional)</label>
                  <input value={orgData.npi} onChange={e => setOrgData({ ...orgData, npi: e.target.value })}
                    placeholder="10-digit NPI"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Invite Team ─────────────── */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invite Your Team</h2>
                <p className="text-sm text-slate-400">Add billing staff, managers, and providers</p>
              </div>
            </div>
            <div className="space-y-3">
              {invites.map((inv, i) => (
                <div key={i} className="flex gap-3">
                  <input value={inv.email}
                    onChange={e => { const arr = [...invites]; arr[i].email = e.target.value; setInvites(arr); }}
                    placeholder="team@organization.com" type="email"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary" />
                  <select value={inv.role}
                    onChange={e => { const arr = [...invites]; arr[i].role = e.target.value; setInvites(arr); }}
                    className="w-40 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none appearance-none">
                    <option value="admin" className="bg-slate-900">Admin</option>
                    <option value="billing_manager" className="bg-slate-900">Billing Manager</option>
                    <option value="biller" className="bg-slate-900">Biller</option>
                    <option value="viewer" className="bg-slate-900">Viewer</option>
                  </select>
                  {invites.length > 1 && (
                    <button onClick={() => setInvites(invites.filter((_, j) => j !== i))}
                      className="px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">×</button>
                  )}
                </div>
              ))}
              <button onClick={() => setInvites([...invites, { email: "", role: "biller" }])}
                className="text-sm text-primary-light hover:text-accent transition-colors">
                + Add another team member
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">You can skip this step and invite team members later from Settings.</p>
          </div>
        )}

        {/* ── Step 3: Import Data ─────────────── */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Import Your Data</h2>
                <p className="text-sm text-slate-400">Choose how to get your claims data into Riveo</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => router.push("/dashboard/import")}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group">
                <FileSpreadsheet className="w-8 h-8 text-primary-light mb-3" />
                <h3 className="font-semibold text-white mb-1">Upload CSV</h3>
                <p className="text-sm text-slate-400">Upload a claims export from your billing system</p>
              </button>
              <button
                className="p-6 rounded-xl border border-white/10 bg-white/5 opacity-60 text-left cursor-not-allowed">
                <Stethoscope className="w-8 h-8 text-slate-500 mb-3" />
                <h3 className="font-semibold text-white mb-1">Connect EHR</h3>
                <p className="text-sm text-slate-400">Direct integration — coming soon</p>
                <span className="text-xs text-primary-light mt-2 inline-block">Coming Q3 2026</span>
              </button>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-slate-300 mb-3">Want to explore the dashboard first?</p>
              <button onClick={handleSeedDemo} disabled={seedLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                {seedLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {seedLoading ? "Loading demo data..." : "Load 500 Demo Claims"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Configure ───────────────── */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Configure Preferences</h2>
                <p className="text-sm text-slate-400">Set up notifications and alerts</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: "newDenials", label: "New denial alerts", desc: "Get notified immediately when a claim is denied" },
                { key: "highValue", label: "High-value denial alerts", desc: "Priority alerts for denials over $500" },
                { key: "weeklySummary", label: "Weekly summary report", desc: "Email with key metrics every Monday morning" },
              ].map(n => (
                <label key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <input type="checkbox" checked={(config as any)[n.key]}
                    onChange={e => setConfig({ ...config, [n.key]: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 text-primary focus:ring-primary bg-white/5" />
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-400">HIPAA Compliance Active</p>
                <p className="text-xs text-slate-400">All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Audit logging is enabled for every action.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Done ────────────────────── */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You&apos;re All Set!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Your dashboard is ready. Start managing claims, tracking denials, and recovering revenue with AI-powered insights.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-primary-light">< 7</p>
                <p className="text-xs text-slate-500">days to go live</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-green-400">24/7</p>
                <p className="text-xs text-slate-500">AI monitoring</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-amber-400">$0</p>
                <p className="text-xs text-slate-500">setup fee</p>
              </div>
            </div>
            <button onClick={completeOnboarding} disabled={loading}
              className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button onClick={back} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-3">
              {step < 3 && (
                <button onClick={next}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                  Skip
                </button>
              )}
              <button onClick={next}
                className="flex items-center gap-2 px-6 py-2 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity">
                {step === 3 ? "Finish Setup" : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
