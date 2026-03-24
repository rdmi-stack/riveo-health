"use client";

import { useState } from "react";
import { Search, Loader2, DollarSign, Brain, Shield, UserCheck, Plus, Trash2, ArrowRight } from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const DEFAULT_PATIENT = { age: 45, employment: "employed", spouseEmployment: "employed", currentCoverage: "self-pay", recentLifeEvent: "none", incomeRange: "40k-60k", state: "CA", isVeteran: false, isDisabled: false, balance: 2500 };

const COVERAGE_COLORS: Record<string, string> = {
  employer: "bg-blue-500/10 text-blue-400", spouse_employer: "bg-cyan-500/10 text-cyan-400",
  medicaid: "bg-green-500/10 text-green-400", medicare: "bg-red-500/10 text-red-400",
  va: "bg-purple-500/10 text-purple-400", marketplace: "bg-amber-500/10 text-amber-400",
  cobra: "bg-orange-500/10 text-orange-400", state_program: "bg-teal-500/10 text-teal-400",
  charity_care: "bg-pink-500/10 text-pink-400", tricare: "bg-indigo-500/10 text-indigo-400",
};

export default function CoverageDiscoveryPage() {
  const [patients, setPatients] = useState([{ ...DEFAULT_PATIENT }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function addPatient() { setPatients([...patients, { ...DEFAULT_PATIENT, age: 30 + Math.floor(Math.random() * 40), balance: 500 + Math.floor(Math.random() * 5000) }]); }
  function removePatient(i: number) { setPatients(patients.filter((_, j) => j !== i)); }
  function updatePatient(i: number, f: string, v: any) { const a = [...patients]; (a[i] as any)[f] = v; setPatients(a); }

  async function discover() {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/coverage-discovery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patients }) });
      const data = await res.json();
      if (data.success) setResult(data);
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Coverage Discovery</h1>
          <p className="text-sm text-slate-400">Find hidden insurance for self-pay patients — $5K-$10K recovered per found policy</p>
        </div>
      </div>

      {/* Patient inputs */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Self-Pay Patients ({patients.length})</h3>
          <button onClick={addPatient} className="flex items-center gap-1.5 text-xs text-primary-light hover:text-accent"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {patients.map((p, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 items-center p-2 rounded-lg bg-white/5 text-xs">
              <div><label className="text-[10px] text-slate-500">Age</label>
                <input type="number" value={p.age} onChange={e => updatePatient(i, "age", parseInt(e.target.value))} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white focus:outline-none" /></div>
              <div><label className="text-[10px] text-slate-500">Employment</label>
                <select value={p.employment} onChange={e => updatePatient(i, "employment", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white appearance-none focus:outline-none">
                  {["employed", "unemployed", "self-employed", "retired", "student", "disabled"].map(o => <option key={o} className="bg-slate-900">{o}</option>)}
                </select></div>
              <div><label className="text-[10px] text-slate-500">Income</label>
                <select value={p.incomeRange} onChange={e => updatePatient(i, "incomeRange", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white appearance-none focus:outline-none">
                  {["under-20k", "20k-40k", "40k-60k", "60k-100k", "100k+"].map(o => <option key={o} className="bg-slate-900">{o}</option>)}
                </select></div>
              <div><label className="text-[10px] text-slate-500">Balance</label>
                <input type="number" value={p.balance} onChange={e => updatePatient(i, "balance", parseInt(e.target.value))} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white focus:outline-none" /></div>
              <div className="flex items-end gap-1">
                <label className="flex items-center gap-1 text-[10px] text-slate-500"><input type="checkbox" checked={p.isVeteran} onChange={e => updatePatient(i, "isVeteran", e.target.checked)} className="w-3 h-3" /> Vet</label>
                <label className="flex items-center gap-1 text-[10px] text-slate-500"><input type="checkbox" checked={p.isDisabled} onChange={e => updatePatient(i, "isDisabled", e.target.checked)} className="w-3 h-3" /> Disabled</label>
              </div>
              <div className="flex justify-end">{patients.length > 1 && <button onClick={() => removePatient(i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>}</div>
            </div>
          ))}
        </div>
        <button onClick={discover} disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 disabled:opacity-40">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Discovering Coverage..." : "Find Hidden Coverage"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {result.batchSummary && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 text-center">
                <p className="text-3xl font-bold text-green-400">{result.batchSummary.patientsWithPotentialCoverage}</p>
                <p className="text-xs text-slate-500">Patients with Coverage Found</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-3xl font-bold text-white">{fmt$(result.batchSummary.totalPotentialRecovery)}</p>
                <p className="text-xs text-slate-500">Potential Recovery</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <div className="flex justify-center gap-2 flex-wrap">
                  {result.batchSummary.topCoverageTypes?.map((t: any, i: number) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${COVERAGE_COLORS[t.type] || "bg-white/10 text-slate-400"}`}>{t.type}: {t.count}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Top Coverage Types</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {result.discoveries?.map((d: any, i: number) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">Patient {d.patientIndex + 1}</span>
                    <span className="text-xs text-slate-500">Balance: {fmt$(patients[d.patientIndex]?.balance || 0)}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.priority === "high" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>{d.priority} priority</span>
                </div>
                <div className="space-y-2">
                  {d.possibleCoverage?.map((c: any, j: number) => (
                    <div key={j} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${COVERAGE_COLORS[c.type] || "bg-white/10 text-slate-400"}`}>{c.type.replace(/_/g, " ")}</span>
                          <span className="text-sm text-white">{c.program}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${c.likelihood >= 70 ? "text-green-400" : "text-amber-400"}`}>{c.likelihood}% likely</span>
                          <span className="text-xs text-slate-500 ml-2">{fmt$(c.estimatedValue)}/yr</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{c.eligibilityCriteria}</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {c.nextStep}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
