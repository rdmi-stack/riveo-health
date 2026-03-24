"use client";

import { useState, useEffect } from "react";
import {
  Calculator, Loader2, Plus, Trash2, DollarSign, CreditCard,
  FileText, Shield, CheckCircle, Send, Printer,
} from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

export default function EstimatesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [form, setForm] = useState({
    patientName: "", payer: "UnitedHealthcare", planType: "PPO", memberId: "",
    deductibleRemaining: 1500, copay: 35, coinsurance: 20, providerName: "",
  });
  const [services, setServices] = useState([{ cptCode: "99214", description: "Office visit, est. patient, level 4", quantity: 1 }]);

  useEffect(() => {
    fetch("/api/estimate?org=demo").then(r => r.json()).then(d => setHistory(d.estimates || []));
  }, []);

  function addService() { setServices([...services, { cptCode: "", description: "", quantity: 1 }]); }
  function removeService(i: number) { setServices(services.filter((_, j) => j !== i)); }
  function updateService(i: number, f: string, v: any) { const a = [...services]; (a[i] as any)[f] = v; setServices(a); }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        const h = await fetch("/api/estimate?org=demo").then(r => r.json());
        setHistory(h.estimates || []);
      }
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Patient Cost Estimates</h1>
          <p className="text-[13px] text-gray-400">Good Faith Estimates — No Surprises Act compliant</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" /> Generate Estimate
            </h3>
            <form onSubmit={generate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Patient Name</label>
                  <input value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}
                    placeholder="John Smith" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Payer</label>
                  <select value={form.payer} onChange={e => setForm({ ...form, payer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none appearance-none">
                    {["UnitedHealthcare", "Blue Cross Blue Shield", "Aetna", "Cigna", "Medicare", "Medicaid", "Self-Pay"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Copay ($)</label>
                  <input type="number" value={form.copay} onChange={e => setForm({ ...form, copay: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Deductible Left ($)</label>
                  <input type="number" value={form.deductibleRemaining} onChange={e => setForm({ ...form, deductibleRemaining: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">Coinsurance (%)</label>
                  <input type="number" value={form.coinsurance} onChange={e => setForm({ ...form, coinsurance: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>

              {/* Services */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] text-gray-500 font-medium">Services / Procedures</label>
                  <button type="button" onClick={addService} className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                <div className="space-y-2">
                  {services.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={s.cptCode} onChange={e => updateService(i, "cptCode", e.target.value)}
                        placeholder="CPT" className="w-24 px-2 py-2 rounded-lg bg-white border border-gray-300 text-[12px] text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      <input value={s.description} onChange={e => updateService(i, "description", e.target.value)}
                        placeholder="Description" className="flex-1 px-2 py-2 rounded-lg bg-white border border-gray-300 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      <input type="number" min={1} value={s.quantity} onChange={e => updateService(i, "quantity", parseInt(e.target.value) || 1)}
                        className="w-14 px-2 py-2 rounded-lg bg-white border border-gray-300 text-[12px] text-gray-900 text-center focus:outline-none" />
                      {services.length > 1 && <button type="button" onClick={() => removeService(i)} className="p-1 text-gray-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading || services.every(s => !s.cptCode)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                {loading ? "Calculating..." : "Generate Estimate"}
              </button>
            </form>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
              <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Recent Estimates</h4>
              <div className="space-y-2">
                {history.slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-[12px] font-medium text-gray-700">{h.patientName || "Patient"}</p>
                      <p className="text-[10px] text-gray-400">{h.payer} · {h.services?.length || 0} services</p>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-900">{fmt$(h.totalPatientResponsibility)}</span>
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
              <Calculator className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Enter services to generate a patient estimate</p>
              <p className="text-[12px] text-gray-300 mt-1">Compliant with No Surprises Act requirements</p>
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-xl border border-indigo-200 p-12 text-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-indigo-600 font-medium">Calculating patient responsibility...</p>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              {/* Total */}
              {result.summary && (
                <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6 text-center">
                  <p className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider mb-1">Estimated Patient Responsibility</p>
                  <p className="text-[36px] font-bold text-indigo-700">{fmt$(result.summary.totalPatientResponsibility)}</p>
                  <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-indigo-500">
                    <span>Copay: {fmt$(result.summary.copayApplied)}</span>
                    <span>Deductible: {fmt$(result.summary.deductibleApplied)}</span>
                    <span>Coinsurance: {fmt$(result.summary.coinsuranceApplied)}</span>
                  </div>
                </div>
              )}

              {/* Line items */}
              {result.services?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <h4 className="text-[13px] font-semibold text-gray-900">Service Breakdown</h4>
                  </div>
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                        <th className="text-left px-5 py-2 font-semibold">Service</th>
                        <th className="text-right px-5 py-2 font-semibold">Charge</th>
                        <th className="text-right px-5 py-2 font-semibold">Insurance</th>
                        <th className="text-right px-5 py-2 font-semibold">You Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.services.map((s: any, i: number) => (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="px-5 py-3">
                            <p className="text-gray-700 font-medium">{s.description}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{s.cptCode}</p>
                          </td>
                          <td className="px-5 py-3 text-right text-gray-500">{fmt$(s.providerCharge)}</td>
                          <td className="px-5 py-3 text-right text-emerald-600">{fmt$(s.insurancePays)}</td>
                          <td className="px-5 py-3 text-right text-gray-900 font-semibold">{fmt$(s.patientResponsibility)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <td className="px-5 py-3 font-semibold text-gray-900">Total</td>
                        <td className="px-5 py-3 text-right text-gray-500 font-medium">{fmt$(result.summary?.totalProviderCharges)}</td>
                        <td className="px-5 py-3 text-right text-emerald-600 font-medium">{fmt$(result.summary?.totalInsurancePays)}</td>
                        <td className="px-5 py-3 text-right text-gray-900 font-bold">{fmt$(result.summary?.totalPatientResponsibility)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Payment plans */}
              {result.paymentOptions?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Options
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {result.paymentOptions.map((p: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center hover:border-indigo-200 transition-colors cursor-pointer">
                        <p className="text-[11px] text-gray-500">{p.option}</p>
                        <p className="text-[16px] font-bold text-gray-900">{p.monthly ? `${fmt$(p.monthly)}/mo` : fmt$(p.amount)}</p>
                        {p.discount && <p className="text-[10px] text-emerald-600">{p.discount}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial assistance */}
              {result.financialAssistance?.mayQualify && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-[12px] font-semibold text-blue-800 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Financial Assistance May Be Available
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1">{result.financialAssistance.message}</p>
                </div>
              )}

              {/* Disclaimer */}
              {result.disclaimer && (
                <p className="text-[10px] text-gray-300 text-center px-4">{result.disclaimer}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-center">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Printer className="w-3.5 h-3.5" /> Print Estimate
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Send className="w-3.5 h-3.5" /> Send to Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
