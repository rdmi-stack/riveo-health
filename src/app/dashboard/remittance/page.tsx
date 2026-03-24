"use client";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertTriangle, DollarSign, FileText, ArrowRight } from "lucide-react";
function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

export default function RemittancePage() {
  const [data, setData] = useState<any>({ postings: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function fetchData() { setLoading(true); const r = await fetch("/api/remittance?org=demo"); setData(await r.json()); setLoading(false); }
  useEffect(() => { fetchData(); }, []);
  async function seed() { setSeeding(true); await fetch("/api/remittance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) }); await fetchData(); setSeeding(false); }

  const s = data.stats;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[20px] font-bold text-gray-900">ERA/Remittance Posting</h1><p className="text-[13px] text-gray-400">Auto-post payments from EOBs/ERAs — exceptions flagged for review</p></div>
        <button onClick={seed} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">{seeding ? "Loading..." : "Load Demo Data"}</button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-[20px] font-bold text-gray-900">{s.total || 0}</p><p className="text-[10px] text-gray-400">Processed</p></div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center"><p className="text-[20px] font-bold text-emerald-600">{s.autoPosted || 0}</p><p className="text-[10px] text-gray-400">Auto-Posted</p></div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center"><p className="text-[20px] font-bold text-amber-600">{s.exceptions || 0}</p><p className="text-[10px] text-gray-400">Exceptions</p></div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center"><p className="text-[20px] font-bold text-emerald-600">{fmt$(s.totalPosted || 0)}</p><p className="text-[10px] text-gray-400">Total Posted</p></div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div> :
      data.postings.length === 0 ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No remittances processed yet</p></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50">
              <th className="text-left px-5 py-2.5">Claim</th><th className="text-left px-5 py-2.5">Payer</th>
              <th className="text-right px-5 py-2.5">Billed</th><th className="text-right px-5 py-2.5">Allowed</th>
              <th className="text-right px-5 py-2.5">Paid</th><th className="text-right px-5 py-2.5">Adjustment</th><th className="text-left px-5 py-2.5">Status</th>
            </tr></thead>
            <tbody>{data.postings.map((p: any, i: number) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-mono text-gray-500">{p.claimId}</td>
                <td className="px-5 py-3 text-gray-700">{p.payer}</td>
                <td className="px-5 py-3 text-right text-gray-500 tabular-nums">{fmt$(p.billedAmount)}</td>
                <td className="px-5 py-3 text-right text-gray-500 tabular-nums">{fmt$(p.allowedAmount)}</td>
                <td className="px-5 py-3 text-right font-semibold text-gray-900 tabular-nums">{fmt$(p.paidAmount)}</td>
                <td className="px-5 py-3 text-right text-rose-600 tabular-nums">{fmt$(p.adjustmentAmount)}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "posted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {p.status === "posted" ? "Auto-Posted" : "Exception"}
                  </span>
                  {p.exceptionReason && <p className="text-[9px] text-amber-600 mt-0.5">{p.exceptionReason}</p>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
