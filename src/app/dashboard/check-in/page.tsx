"use client";
import { useState, useEffect } from "react";
import { ClipboardList, Loader2, CheckCircle, Clock, User } from "lucide-react";

export default function CheckInPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  async function fetchData() { setLoading(true); const r = await fetch("/api/check-in?org=demo"); const d = await r.json(); setCheckins(d.checkins || []); setStats({ total: d.total || 0, completed: d.completed || 0 }); setLoading(false); }
  useEffect(() => { fetchData(); }, []);
  async function seed() { setSeeding(true); await fetch("/api/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) }); await fetchData(); setSeeding(false); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[20px] font-bold text-gray-900">Digital Check-In</h1><p className="text-[13px] text-gray-400">Mobile patient intake — registration, insurance, consent before the visit</p></div>
        <button onClick={seed} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">{seeding ? "Loading..." : "Load Demo"}</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-[20px] font-bold text-gray-900">{stats.total}</p><p className="text-[10px] text-gray-400">Total Check-Ins</p></div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center"><p className="text-[20px] font-bold text-emerald-600">{stats.completed}</p><p className="text-[10px] text-gray-400">Completed</p></div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center"><p className="text-[20px] font-bold text-amber-600">{stats.total - stats.completed}</p><p className="text-[10px] text-gray-400">In Progress</p></div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div> :
      checkins.length === 0 ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No check-ins yet</p></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50">
              <th className="text-left px-5 py-2.5">Patient</th><th className="text-left px-5 py-2.5">Contact</th><th className="text-left px-5 py-2.5">Insurance</th><th className="text-left px-5 py-2.5">Reason</th><th className="text-left px-5 py-2.5">Consent</th><th className="text-left px-5 py-2.5">Status</th>
            </tr></thead>
            <tbody>{checkins.map((c, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3"><p className="font-medium text-gray-700">{c.firstName} {c.lastName}</p><p className="text-[10px] text-gray-400">{c.patientId} · DOB: {c.dob}</p></td>
                <td className="px-5 py-3 text-gray-500"><p>{c.email}</p><p className="text-[10px]">{c.phone}</p></td>
                <td className="px-5 py-3 text-gray-500">{c.insurance?.payer || "—"}<br/><span className="text-[10px]">{c.insurance?.memberId}</span></td>
                <td className="px-5 py-3 text-gray-500">{c.reasonForVisit || "—"}</td>
                <td className="px-5 py-3">{c.consentSigned ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}</td>
                <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{c.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
