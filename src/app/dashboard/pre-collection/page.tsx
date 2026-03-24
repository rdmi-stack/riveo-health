"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, ArrowRight, CheckCircle, AlertTriangle, Clock, DollarSign, Send, Phone, Mail, MessageSquare, Brain, Shield } from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const STEP_ICONS: Record<number, React.ElementType> = { 1: Mail, 2: MessageSquare, 3: Mail, 4: DollarSign, 5: Phone, 6: Shield, 7: AlertTriangle };
const STATUS_COLORS: Record<string, string> = {
  early_engagement: "bg-blue-500/10 text-blue-400",
  active_outreach: "bg-amber-500/10 text-amber-400",
  final_notice: "bg-red-500/10 text-red-400",
  resolved: "bg-green-500/10 text-green-400",
  external_collections: "bg-slate-500/10 text-slate-400",
};

const SAMPLE_ACCOUNTS = [
  { patientId: "PAT-0012", balance: 850, daysPastDue: 5 },
  { patientId: "PAT-0034", balance: 320, daysPastDue: 18 },
  { patientId: "PAT-0056", balance: 1200, daysPastDue: 35 },
  { patientId: "PAT-0078", balance: 175, daysPastDue: 48 },
  { patientId: "PAT-0091", balance: 2400, daysPastDue: 62 },
  { patientId: "PAT-0103", balance: 550, daysPastDue: 12 },
  { patientId: "PAT-0117", balance: 420, daysPastDue: 28 },
  { patientId: "PAT-0129", balance: 780, daysPastDue: 55 },
];

export default function PreCollectionPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any>({});
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  useEffect(() => {
    fetch("/api/pre-collection?org=demo").then(r => r.json()).then(d => {
      setAccounts(d.accounts || []);
      setTotalOutstanding(d.totalOutstanding || 0);
    }).finally(() => setLoading(false));
  }, []);

  async function generatePlans() {
    setGenerating(true); setMessages([]);
    try {
      const res = await fetch("/api/pre-collection", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accounts: SAMPLE_ACCOUNTS }) });
      const data = await res.json();
      if (data.success) {
        setBreakdown(data.breakdown || {});
        setMessages(data.aiMessages || []);
        // Refresh
        const list = await fetch("/api/pre-collection?org=demo").then(r => r.json());
        setAccounts(list.accounts || []);
        setTotalOutstanding(list.totalOutstanding || 0);
      }
    } finally { setGenerating(false); }
  }

  async function updateAccount(id: string, action: string) {
    await fetch("/api/pre-collection", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (action === "resolve") {
      setAccounts(prev => prev.filter(a => a._id !== id));
    } else {
      setAccounts(prev => prev.map(a => a._id === id ? { ...a, currentStep: Math.min((a.currentStep || 1) + 1, 7) } : a));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pre-Collection Engagement</h1>
          <p className="text-sm text-slate-400">Automated escalation workflow before sending to external collections — recovers 3-5x more</p>
        </div>
        <button onClick={generatePlans} disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 disabled:opacity-40">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Plans (Demo Data)"}
        </button>
      </div>

      {/* 7-Step Workflow Visual */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">7-Step Escalation Workflow</h3>
        <div className="grid grid-cols-7 gap-2">
          {[
            { step: 1, name: "Digital Bill", day: "Day 0" },
            { step: 2, name: "SMS Remind", day: "Day 7" },
            { step: 3, name: "Email F/U", day: "Day 14" },
            { step: 4, name: "Plan Offer", day: "Day 21" },
            { step: 5, name: "Phone Call", day: "Day 30" },
            { step: 6, name: "Hardship", day: "Day 45" },
            { step: 7, name: "Final Notice", day: "Day 60" },
          ].map((s, i) => {
            const Icon = STEP_ICONS[s.step] || Mail;
            return (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[10px] font-medium text-white">{s.name}</p>
                <p className="text-[9px] text-slate-500">{s.day}</p>
                {i < 6 && <ArrowRight className="w-3 h-3 text-slate-600 mx-auto mt-1 hidden md:block" />}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">Each step is personalized by AI based on patient profile, balance, and payment history. Only send to external collections after all 7 steps fail.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-white">{accounts.length}</p>
          <p className="text-xs text-slate-500">Active Accounts</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{fmt$(totalOutstanding)}</p>
          <p className="text-xs text-slate-500">Outstanding</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{breakdown.activeOutreach || 0}</p>
          <p className="text-xs text-slate-500">Active Outreach</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{fmt$(Math.round(totalOutstanding * 0.65))}</p>
          <p className="text-xs text-slate-500">Est. Recovery</p>
        </div>
      </div>

      {/* AI Messages */}
      {messages.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-6">
          <h3 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> AI-Generated Messages</h3>
          <div className="space-y-3">
            {messages.map((m: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-white/5">
                <p className="text-xs text-slate-500 mb-1">Patient {m.patientId} · Tone: {m.tone}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
                    <p className="text-[10px] text-green-400 mb-1">SMS ({m.smsMessage?.length || 0} chars)</p>
                    <p className="text-xs text-slate-300">{m.smsMessage}</p>
                  </div>
                  <div className="p-2 rounded bg-blue-500/5 border border-blue-500/10">
                    <p className="text-[10px] text-blue-400 mb-1">Email: {m.emailSubject}</p>
                    <p className="text-xs text-slate-300">{m.emailBody?.slice(0, 150)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account list */}
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div> :
      accounts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No pre-collection accounts</p>
          <p className="text-sm text-slate-500">Click &quot;Generate Plans&quot; to load demo data and see the workflow in action.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-500 border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3">Patient</th><th className="text-right px-4 py-3">Balance</th>
              <th className="text-right px-4 py-3">Days Past Due</th><th className="text-center px-4 py-3">Step</th>
              <th className="text-left px-4 py-3">Next Action</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {accounts.map((a, i) => {
                const sc = STATUS_COLORS[a.status] || STATUS_COLORS.early_engagement;
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{a.patientId}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{fmt$(a.balance)}</td>
                    <td className="px-4 py-3 text-right text-amber-400">{a.daysPastDue}</td>
                    <td className="px-4 py-3 text-center"><span className="text-xs text-slate-400">{a.currentStep}/{a.totalSteps}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-300">{a.nextAction?.name || "-"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${sc}`}>{a.status?.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 flex gap-1">
                      <button onClick={() => updateAccount(a._id, "advance")} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-light hover:bg-primary/20">Next Step</button>
                      <button onClick={() => updateAccount(a._id, "resolve")} className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20">Paid</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
