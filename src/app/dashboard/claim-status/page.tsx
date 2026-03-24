"use client";
import { useState, useEffect } from "react";
import { RefreshCw, Loader2, CheckCircle, Clock, AlertTriangle, XCircle, Brain } from "lucide-react";
function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const SAMPLE_CLAIMS = [
  { claimId: "CLM-00005", payer: "UnitedHealthcare", submittedDate: "2026-02-20", billedAmount: 450 },
  { claimId: "CLM-00012", payer: "Aetna", submittedDate: "2026-03-01", billedAmount: 220 },
  { claimId: "CLM-00018", payer: "Medicare", submittedDate: "2026-02-15", billedAmount: 680 },
  { claimId: "CLM-00023", payer: "BCBS", submittedDate: "2026-03-05", billedAmount: 350 },
  { claimId: "CLM-00031", payer: "Cigna", submittedDate: "2026-02-28", billedAmount: 190 },
];

const STATUS_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  approved: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
  paid: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
  received: { icon: Clock, color: "text-blue-600 bg-blue-50" },
  in_review: { icon: Clock, color: "text-indigo-600 bg-indigo-50" },
  pending_info: { icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  denied: { icon: XCircle, color: "text-rose-600 bg-rose-50" },
  rejected: { icon: XCircle, color: "text-rose-600 bg-rose-50" },
};

export default function ClaimStatusPage() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function checkStatus() {
    setChecking(true); setResult(null);
    const res = await fetch("/api/claim-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claims: SAMPLE_CLAIMS }) });
    const data = await res.json();
    if (data.success) setResult(data);
    setChecking(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[20px] font-bold text-gray-900">Claim Status Check</h1><p className="text-[13px] text-gray-400">Auto-poll payers for real-time claim status updates</p></div>
        <button onClick={checkStatus} disabled={checking} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 disabled:opacity-50">
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} {checking ? "Checking..." : "Check Status Now"}
        </button>
      </div>
      {!result && !checking && <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><RefreshCw className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">Click &quot;Check Status Now&quot; to poll payers for updates on {SAMPLE_CLAIMS.length} claims</p></div>}
      {checking && <div className="bg-white rounded-xl border border-indigo-200 p-12 text-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" /><p className="text-indigo-600 font-medium">Polling payers for status updates...</p></div>}
      {result && !checking && (
        <div>
          {result.summary && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-[20px] font-bold text-gray-900">{result.summary.total}</p><p className="text-[10px] text-gray-400">Checked</p></div>
              <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center"><p className="text-[20px] font-bold text-emerald-600">{result.summary.approved}</p><p className="text-[10px] text-gray-400">Approved</p></div>
              <div className="bg-white rounded-xl border border-amber-200 p-4 text-center"><p className="text-[20px] font-bold text-amber-600">{result.summary.actionRequired}</p><p className="text-[10px] text-gray-400">Action Needed</p></div>
              <div className="bg-white rounded-xl border border-rose-200 p-4 text-center"><p className="text-[20px] font-bold text-rose-600">{result.summary.denied}</p><p className="text-[10px] text-gray-400">Denied</p></div>
            </div>
          )}
          <div className="space-y-3">
            {result.statusResults?.map((r: any, i: number) => {
              const claim = SAMPLE_CLAIMS[r.claimIndex] || SAMPLE_CLAIMS[i];
              const si = STATUS_ICONS[r.payerStatus] || STATUS_ICONS.received;
              return (
                <div key={i} className={`bg-white rounded-xl border border-gray-200 p-5 ${r.actionRequired ? "ring-1 ring-amber-200" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${si.color}`}><si.icon className="w-4 h-4" /></div>
                      <div><p className="text-[13px] font-semibold text-gray-900">{claim?.claimId} — {claim?.payer}</p><p className="text-[11px] text-gray-400">{fmt$(claim?.billedAmount || 0)} · Submitted {claim?.submittedDate}</p></div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${si.color}`}>{r.payerStatus?.replace("_", " ")}</span>
                  </div>
                  <div className="ml-11 text-[12px] space-y-1">
                    {r.statusDate && <p className="text-gray-500">Status date: {r.statusDate}</p>}
                    {r.estimatedPaymentDate && <p className="text-emerald-600">Est. payment: {r.estimatedPaymentDate}</p>}
                    {r.amountApproved > 0 && <p className="text-emerald-600">Approved: {fmt$(r.amountApproved)}</p>}
                    {r.actionRequired && <p className="text-amber-600 font-medium">Action: {r.actionDescription}</p>}
                    {r.notes && <p className="text-gray-400">{r.notes}</p>}
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
