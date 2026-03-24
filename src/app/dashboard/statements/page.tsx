"use client";

import { useState, useEffect } from "react";
import {
  Send, Loader2, CheckCircle, Clock, Eye, Mail, MessageSquare,
  DollarSign, FileText, Users, ArrowRight,
} from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  sent: { color: "bg-blue-50 text-blue-700", label: "Sent" },
  opened: { color: "bg-amber-50 text-amber-700", label: "Opened" },
  paid: { color: "bg-emerald-50 text-emerald-700", label: "Paid" },
};

export default function StatementsPage() {
  const [statements, setStatements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/statements?org=demo");
    const data = await res.json();
    setStatements(data.statements || []);
    setStats(data.stats || {});
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function seedDemo() {
    setSeeding(true);
    await fetch("/api/statements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) });
    await fetchData();
    setSeeding(false);
  }

  async function markPaid(id: string) {
    await fetch("/api/statements", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "paid" }) });
    setStatements(prev => prev.map(s => s._id === id ? { ...s, status: "paid", paidAt: new Date() } : s));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Digital Statements</h1>
          <p className="text-[13px] text-gray-400">Send digital bills via SMS + email — patients click and pay instantly</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedDemo} disabled={seeding}
            className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40">
            {seeding ? "Loading..." : "Load Demo Statements"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-[20px] font-bold text-gray-900">{stats.totalSent || 0}</p>
          <p className="text-[10px] text-gray-400">Sent</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-[20px] font-bold text-indigo-600">{stats.openRate || 0}%</p>
          <p className="text-[10px] text-gray-400">Open Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-[20px] font-bold text-emerald-600">{stats.totalPaid || 0}</p>
          <p className="text-[10px] text-gray-400">Paid</p>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 text-center">
          <p className="text-[20px] font-bold text-rose-600">{fmt$(stats.totalBalance || 0)}</p>
          <p className="text-[10px] text-gray-400">Outstanding</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center">
          <p className="text-[20px] font-bold text-emerald-600">{fmt$(stats.totalCollected || 0)}</p>
          <p className="text-[10px] text-gray-400">Collected</p>
        </div>
      </div>

      {/* Statement list */}
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div> :
      statements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Send className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No statements sent yet</p>
          <p className="text-[12px] text-gray-400 mt-1">Click &quot;Load Demo Statements&quot; to see digital billing in action.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50">
                <th className="text-left px-5 py-2.5 font-semibold">Patient</th>
                <th className="text-left px-5 py-2.5 font-semibold">Channels</th>
                <th className="text-right px-5 py-2.5 font-semibold">Balance</th>
                <th className="text-left px-5 py-2.5 font-semibold">Pay Link</th>
                <th className="text-left px-5 py-2.5 font-semibold">Status</th>
                <th className="text-left px-5 py-2.5 font-semibold">Sent</th>
                <th className="text-left px-5 py-2.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((s, i) => {
                const st = STATUS_STYLES[s.status] || STATUS_STYLES.sent;
                return (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="text-[12px] font-medium text-gray-700">{s.patientName}</p>
                      <p className="text-[10px] text-gray-400">{s.patientId}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        {s.channels?.sms && <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"><MessageSquare className="w-2.5 h-2.5" /> SMS</span>}
                        {s.channels?.email && <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700"><Mail className="w-2.5 h-2.5" /> Email</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-[12px] font-semibold text-gray-900 tabular-nums">{fmt$(s.balance)}</td>
                    <td className="px-5 py-3">
                      <code className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">{s.payToken}</code>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      {s.status !== "paid" && (
                        <button onClick={() => markPaid(s._id)} className="text-[11px] px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium">
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-4">How Text-to-Pay Works</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Send, title: "Send Statement", desc: "Digital bill sent via SMS + email" },
            { icon: Eye, title: "Patient Opens", desc: "Patient clicks the pay link" },
            { icon: DollarSign, title: "One-Click Pay", desc: "Full or partial payment, card on file" },
            { icon: CheckCircle, title: "Instant Post", desc: "Payment posts to account in real-time" },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                <step.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-[12px] font-semibold text-gray-700">{step.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
