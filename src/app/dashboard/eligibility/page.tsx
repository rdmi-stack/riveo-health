"use client";

import { useState, useEffect } from "react";
import {
  Shield, Loader2, CheckCircle, XCircle, AlertTriangle, Search,
  User, CreditCard, Calendar, Building2, ArrowRight, Clock, Info,
} from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const PAYERS = ["UnitedHealthcare", "Blue Cross Blue Shield", "Aetna", "Cigna", "Humana", "Medicare", "Medicaid", "Kaiser Permanente"];

export default function EligibilityPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [historyLoading, setHistoryLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", memberId: "",
    payer: "UnitedHealthcare", groupNumber: "", subscriberRelation: "self",
    serviceType: "Office Visit", cptCode: "99213", dateOfService: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetch("/api/eligibility?org=demo")
      .then(r => r.json())
      .then(d => { setHistory(d.verifications || []); setStats(d.stats || {}); })
      .finally(() => setHistoryLoading(false));
  }, []);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        // Refresh history
        const h = await fetch("/api/eligibility?org=demo").then(r => r.json());
        setHistory(h.verifications || []); setStats(h.stats || {});
      }
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Eligibility Verification</h1>
          <p className="text-[13px] text-gray-400">Real-time insurance verification — check coverage, copay, deductible, and alerts before the visit</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          <p className="text-[11px] text-gray-400">Verifications</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.eligible || 0}</p>
          <p className="text-[11px] text-gray-400">Eligible</p>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 text-center">
          <p className="text-2xl font-bold text-rose-600">{stats.ineligible || 0}</p>
          <p className="text-[11px] text-gray-400">Ineligible</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.alertsRaised || 0}</p>
          <p className="text-[11px] text-gray-400">Alerts Raised</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verification form */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" /> Verify Patient Coverage
            </h3>
            <form onSubmit={verify} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">First Name</label>
                  <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    placeholder="John" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Last Name</label>
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Smith" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Member ID *</label>
                  <input required value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })}
                    placeholder="UHC123456789" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Payer *</label>
                  <select required value={form.payer} onChange={e => setForm({ ...form, payer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none appearance-none">
                    {PAYERS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Group Number</label>
                  <input value={form.groupNumber} onChange={e => setForm({ ...form, groupNumber: e.target.value })}
                    placeholder="GRP001" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Service Type</label>
                  <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none appearance-none">
                    {["Office Visit", "Specialist Visit", "Emergency", "Imaging", "Lab", "Surgery", "Therapy", "Mental Health"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Date of Service</label>
                  <input type="date" value={form.dateOfService} onChange={e => setForm({ ...form, dateOfService: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Verifying..." : "Verify Eligibility"}
              </button>
            </form>
          </div>

          {/* Recent verifications */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
              <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Recent Verifications</h4>
              <div className="space-y-2">
                {history.slice(0, 6).map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {v.eligible ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                      <div>
                        <p className="text-[12px] font-medium text-gray-700">{v.patientName || v.memberId}</p>
                        <p className="text-[10px] text-gray-400">{v.payer}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.eligible ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {v.eligible ? "Eligible" : "Ineligible"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Shield className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Enter patient details to verify coverage</p>
              <p className="text-[12px] text-gray-300 mt-1">Results include copay, deductible, prior auth, and secondary insurance</p>
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-xl border border-indigo-200 p-12 text-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-indigo-600 font-medium">Verifying with {form.payer}...</p>
              <p className="text-[12px] text-gray-400 mt-1">Checking coverage, benefits, and alerts</p>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              {/* Status banner */}
              <div className={`rounded-xl border p-5 ${result.eligible ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                <div className="flex items-center gap-3">
                  {result.eligible ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-rose-600" />}
                  <div>
                    <p className={`text-lg font-bold ${result.eligible ? "text-emerald-800" : "text-rose-800"}`}>
                      {result.eligible ? "Patient is Eligible" : "Patient is Not Eligible"}
                    </p>
                    <p className={`text-[12px] ${result.eligible ? "text-emerald-600" : "text-rose-600"}`}>
                      Status: {result.status?.toUpperCase()} · Verified just now
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Info */}
              {result.planInfo && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" /> Plan Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div><span className="text-gray-400">Plan</span><p className="text-gray-700 font-medium">{result.planInfo.planName}</p></div>
                    <div><span className="text-gray-400">Type</span><p className="text-gray-700 font-medium">{result.planInfo.planType}</p></div>
                    <div><span className="text-gray-400">Group</span><p className="text-gray-700 font-medium">{result.planInfo.groupName}</p></div>
                    <div><span className="text-gray-400">Effective</span><p className="text-gray-700 font-medium">{result.planInfo.effectiveDate}</p></div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {result.benefits && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" /> Benefits Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                      <p className="text-[20px] font-bold text-gray-900">{fmt$(result.benefits.copay)}</p>
                      <p className="text-[10px] text-gray-400">Copay</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
                      <p className="text-[20px] font-bold text-gray-900">{result.benefits.coinsurance}%</p>
                      <p className="text-[10px] text-gray-400">Coinsurance</p>
                    </div>
                  </div>
                  {result.benefits.deductible && (
                    <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-[11px] text-gray-400 mb-1">Deductible (Individual)</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-gray-900">{fmt$(result.benefits.deductible.individual)}</span>
                        <span className="text-[11px] text-amber-600">Remaining: {fmt$(result.benefits.deductible.remaining)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${result.benefits.deductible.individual > 0 ? ((result.benefits.deductible.met / result.benefits.deductible.individual) * 100) : 0}%` }} />
                      </div>
                    </div>
                  )}
                  {result.benefits.outOfPocketMax && (
                    <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-[11px] text-gray-400 mb-1">Out-of-Pocket Max (Individual)</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-gray-900">{fmt$(result.benefits.outOfPocketMax.individual)}</span>
                        <span className="text-[11px] text-amber-600">Remaining: {fmt$(result.benefits.outOfPocketMax.remaining)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Service-Specific */}
              {result.serviceSpecific && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex justify-between"><span className="text-gray-400">Covered</span><span className={result.serviceSpecific.covered ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>{result.serviceSpecific.covered ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Prior Auth Required</span><span className={result.serviceSpecific.priorAuthRequired ? "text-amber-600 font-medium" : "text-gray-600"}>{result.serviceSpecific.priorAuthRequired ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Referral Required</span><span className="text-gray-600">{result.serviceSpecific.referralRequired ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Est. Patient Responsibility</span><span className="text-gray-900 font-semibold">{fmt$(result.serviceSpecific.estimatedPatientResponsibility)}</span></div>
                  </div>
                </div>
              )}

              {/* Secondary Insurance */}
              {result.secondaryInsurance?.detected && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-[12px] font-semibold text-blue-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Secondary Insurance Detected
                  </p>
                  <p className="text-[12px] text-blue-700 mt-1">{result.secondaryInsurance.payerName} — {result.secondaryInsurance.memberId}</p>
                </div>
              )}

              {/* Alerts */}
              {result.alerts?.length > 0 && (
                <div className="space-y-2">
                  {result.alerts.map((a: any, i: number) => (
                    <div key={i} className={`rounded-lg border p-3 flex items-start gap-2.5 ${
                      a.severity === "high" ? "border-rose-200 bg-rose-50" : a.severity === "medium" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"
                    }`}>
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${a.severity === "high" ? "text-rose-600" : a.severity === "medium" ? "text-amber-600" : "text-blue-600"}`} />
                      <div>
                        <p className={`text-[12px] font-medium ${a.severity === "high" ? "text-rose-800" : a.severity === "medium" ? "text-amber-800" : "text-blue-800"}`}>{a.type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                        <p className={`text-[11px] ${a.severity === "high" ? "text-rose-600" : a.severity === "medium" ? "text-amber-600" : "text-blue-600"}`}>{a.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
