"use client";

import { useState } from "react";
import { Users, Loader2, MessageSquare, Mail, Phone, Send, Brain, DollarSign, Clock, Zap, Plus, Trash2 } from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const CHANNEL_ICONS: Record<string, React.ElementType> = { sms: MessageSquare, email: Mail, phone: Phone, mail: Send, portal: Users };
const CHANNEL_COLORS: Record<string, string> = { sms: "text-green-400 bg-green-500/10", email: "text-blue-400 bg-blue-500/10", phone: "text-amber-400 bg-amber-500/10", mail: "text-slate-400 bg-slate-500/10", portal: "text-primary-light bg-primary/10" };

const DEFAULT_PATIENT = { balance: 500, ageGroup: "35-54", paymentHistory: "sometimes_late", preferredChannel: "sms", daysPastDue: 30, hasInsurance: true };

export default function PatientBillingPage() {
  const [patients, setPatients] = useState([{ ...DEFAULT_PATIENT }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function addPatient() { setPatients([...patients, { ...DEFAULT_PATIENT, balance: 200 + Math.floor(Math.random() * 800) }]); }
  function removePatient(i: number) { setPatients(patients.filter((_, j) => j !== i)); }
  function updatePatient(i: number, field: string, value: any) {
    const arr = [...patients]; (arr[i] as any)[field] = value; setPatients(arr);
  }

  async function generateStrategies() {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/patient-billing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patients }) });
      const data = await res.json();
      if (data.success) setResult(data);
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Personalized Patient Billing</h1>
          <p className="text-sm text-slate-400">AI picks the optimal channel, timing, message, and payment plan per patient</p>
        </div>
      </div>

      {/* Patient inputs */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Patient Balances ({patients.length})</h3>
          <button onClick={addPatient} className="flex items-center gap-1.5 text-xs text-primary-light hover:text-accent"><Plus className="w-3 h-3" /> Add Patient</button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {patients.map((p, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 items-center p-3 rounded-lg bg-white/5">
              <div>
                <label className="text-[10px] text-slate-500">Balance</label>
                <input type="number" value={p.balance} onChange={e => updatePatient(i, "balance", parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Age Group</label>
                <select value={p.ageGroup} onChange={e => updatePatient(i, "ageGroup", e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white appearance-none focus:outline-none">
                  {["18-34", "35-54", "55-64", "65+"].map(a => <option key={a} className="bg-slate-900">{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Pay History</label>
                <select value={p.paymentHistory} onChange={e => updatePatient(i, "paymentHistory", e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white appearance-none focus:outline-none">
                  {["always_on_time", "sometimes_late", "frequently_late", "no_history"].map(h => <option key={h} className="bg-slate-900">{h.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Days Past Due</label>
                <input type="number" value={p.daysPastDue} onChange={e => updatePatient(i, "daysPastDue", parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Channel</label>
                <select value={p.preferredChannel} onChange={e => updatePatient(i, "preferredChannel", e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white appearance-none focus:outline-none">
                  {["sms", "email", "phone", "mail", "portal"].map(c => <option key={c} className="bg-slate-900">{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end">
                {patients.length > 1 && <button onClick={() => removePatient(i)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={generateStrategies} disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 disabled:opacity-40">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? "Generating Strategies..." : "Generate Personalized Billing Strategies"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Batch insights */}
          {result.batchInsights && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{result.batchInsights.avgCollectProbability}%</p>
                <p className="text-[10px] text-slate-500">Avg Collection Probability</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{fmt$(result.batchInsights.totalExpectedRecovery)}</p>
                <p className="text-[10px] text-slate-500">Expected Recovery</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{result.batchInsights.patientsNeedingHardship}</p>
                <p className="text-[10px] text-slate-500">Need Hardship Screening</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="flex justify-center gap-2">
                  {result.batchInsights.recommendedChannelBreakdown && Object.entries(result.batchInsights.recommendedChannelBreakdown).map(([ch, count]: [string, any]) => (
                    count > 0 && <span key={ch} className="text-xs text-slate-400">{ch}: {count}</span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Channel Mix</p>
              </div>
            </div>
          )}

          {/* Individual strategies */}
          <div className="space-y-3">
            {result.strategies?.map((s: any, i: number) => {
              const ChIcon = CHANNEL_ICONS[s.recommendedChannel] || MessageSquare;
              const chColor = CHANNEL_COLORS[s.recommendedChannel] || "text-white bg-white/10";
              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${chColor}`}>
                        <ChIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Patient {s.patientIndex + 1} — {fmt$(patients[s.patientIndex]?.balance || 0)} balance</p>
                        <p className="text-xs text-slate-500">{s.recommendedChannel.toUpperCase()} · {s.messageTone} · {s.optimalSendTime} · {s.optimalSendDay}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${s.collectProbability >= 70 ? "text-green-400" : s.collectProbability >= 40 ? "text-amber-400" : "text-red-400"}`}>{s.collectProbability}%</p>
                      <p className="text-[10px] text-slate-500">Collect Prob.</p>
                    </div>
                  </div>
                  {/* Sample message */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-3">
                    <p className="text-xs text-primary-light mb-1 font-medium">Recommended Message</p>
                    <p className="text-sm text-slate-300">{s.sampleMessage}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    {s.paymentPlanRecommendation?.offered && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-400">
                        <DollarSign className="w-3 h-3" /> Plan: {fmt$(s.paymentPlanRecommendation.monthlyAmount)}/mo × {s.paymentPlanRecommendation.months}mo
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5"><Clock className="w-3 h-3" /> Follow-up in {s.followUpDays} days</span>
                    <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5"><Zap className="w-3 h-3" /> {s.escalationTrigger}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
