"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity, DollarSign, CreditCard, FileText, MessageSquare,
  Loader2, CheckCircle, Clock, Send, Calendar, Shield,
  ChevronRight, AlertCircle, Download, HelpCircle,
} from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

type Tab = "bills" | "payments" | "message";

export default function PatientPortalPage() {
  const [tab, setTab] = useState<Tab>("bills");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [planModal, setPlanModal] = useState<any>(null);
  const [planMonths, setPlanMonths] = useState(3);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [seeding, setSeeding] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`https://riveo-health-api-production.up.railway.app/api/patient-portal?patientId=PAT-DEMO&org=demo`);
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function seedDemo() {
    setSeeding(true);
    await fetch(`https://riveo-health-api-production.up.railway.app/api/patient-portal`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) });
    await fetchData();
    setSeeding(false);
  }

  async function makePayment(billId: string, amount: number) {
    setPaying(billId);
    await fetch(`https://riveo-health-api-production.up.railway.app/api/patient-portal`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pay", billId, amount, patientId: "PAT-DEMO" }) });
    await fetchData();
    setPaying(null);
  }

  async function setupPlan(billId: string) {
    const monthly = Math.ceil(planModal.balance / planMonths);
    await fetch(`https://riveo-health-api-production.up.railway.app/api/patient-portal`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup_plan", billId, months: planMonths, monthlyAmount: monthly, patientId: "PAT-DEMO" }) });
    setPlanModal(null);
    await fetchData();
  }

  async function sendMessage() {
    if (!message.trim()) return;
    await fetch(`https://riveo-health-api-production.up.railway.app/api/patient-portal`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", message, patientId: "PAT-DEMO" }) });
    setMessage(""); setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <Activity className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[14px] font-bold text-gray-900">Riveo <span className="text-indigo-600">Health</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-50"><HelpCircle className="w-[17px] h-[17px] text-gray-400" /></button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-700">JS</div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900">My Bills & Payments</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">View your statements, make payments, and manage your account</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
        ) : !data || data.billCount === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">No bills found</p>
            <p className="text-[13px] text-gray-400 mb-4">Demo patient portal — load sample bills to explore.</p>
            <button onClick={seedDemo} disabled={seeding}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 mx-auto">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {seeding ? "Loading..." : "Load Demo Bills"}
            </button>
          </div>
        ) : (
          <>
            {/* Balance card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total Balance Due</p>
                  <p className="text-[32px] font-bold text-gray-900 mt-1">{fmt$(data.totalBalance)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total Paid</p>
                  <p className="text-[32px] font-bold text-emerald-600 mt-1">{fmt$(data.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Open Bills</p>
                  <p className="text-[32px] font-bold text-gray-900 mt-1">{data.bills?.filter((b: any) => b.balance > 0).length}</p>
                </div>
              </div>
              {data.totalBalance > 0 && (
                <button onClick={() => makePayment("", data.totalBalance)}
                  className="mt-4 w-full py-3 rounded-lg bg-indigo-600 text-white font-medium text-[14px] hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pay Full Balance — {fmt$(data.totalBalance)}
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit mb-6">
              {([["bills", "My Bills", FileText], ["payments", "Payment History", DollarSign], ["message", "Contact Billing", MessageSquare]] as [Tab, string, any][]).map(([key, label, Icon]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium rounded-md transition-all ${
                    tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Bills */}
            {tab === "bills" && (
              <div className="space-y-3">
                {data.bills?.filter((b: any) => b.balance > 0).map((bill: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">{bill.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {bill.dateOfService}</span>
                          <span className="font-mono">{bill.cptCode}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[18px] font-bold text-gray-900">{fmt$(bill.balance)}</p>
                        <p className="text-[10px] text-gray-400">of {fmt$(bill.totalCharge)} total</p>
                      </div>
                    </div>
                    {/* Charge breakdown */}
                    <div className="flex items-center gap-2 mb-3 text-[11px]">
                      <span className="text-gray-400">Charged: {fmt$(bill.totalCharge)}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                      <span className="text-emerald-600">Insurance paid: {fmt$(bill.insurancePaid)}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                      <span className="text-gray-900 font-semibold">You owe: {fmt$(bill.balance)}</span>
                    </div>
                    {/* Payment plan info */}
                    {bill.paymentPlan?.active && (
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 mb-3 text-[12px]">
                        <p className="text-indigo-700 font-medium">Payment plan active: {fmt$(bill.paymentPlan.monthlyAmount)}/month for {bill.paymentPlan.months} months</p>
                      </div>
                    )}
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => makePayment(bill._id, bill.balance)} disabled={paying === bill._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-indigo-600 text-white text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50">
                        {paying === bill._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                        Pay {fmt$(bill.balance)}
                      </button>
                      {bill.balance > 100 && !bill.paymentPlan?.active && (
                        <button onClick={() => setPlanModal(bill)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-[12px] font-medium hover:bg-gray-50">
                          <Clock className="w-3.5 h-3.5" /> Payment Plan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Paid bills */}
                {data.bills?.filter((b: any) => b.balance === 0).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-[13px] font-semibold text-gray-400 mb-2">Paid</h3>
                    {data.bills.filter((b: any) => b.balance === 0).map((bill: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 mb-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-[12px] text-gray-600">{bill.description}</span>
                        </div>
                        <span className="text-[12px] text-gray-400">{fmt$(bill.totalCharge)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments */}
            {tab === "payments" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {data.payments?.length > 0 ? (
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50">
                        <th className="text-left px-5 py-2.5 font-semibold">Date</th>
                        <th className="text-left px-5 py-2.5 font-semibold">Confirmation</th>
                        <th className="text-left px-5 py-2.5 font-semibold">Method</th>
                        <th className="text-right px-5 py-2.5 font-semibold">Amount</th>
                        <th className="text-left px-5 py-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payments.map((p: any, i: number) => (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="px-5 py-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3 font-mono text-gray-700">{p.confirmationNumber}</td>
                          <td className="px-5 py-3 text-gray-500 capitalize">{p.method}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-900">{fmt$(p.amount)}</td>
                          <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">Completed</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center"><p className="text-gray-400">No payments yet</p></div>
                )}
              </div>
            )}

            {/* Message */}
            {tab === "message" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Contact Billing Department</h3>
                <p className="text-[12px] text-gray-400 mb-4">Have a question about your bill? We typically respond within 1 business day.</p>
                {messageSent && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-[12px]">
                    <CheckCircle className="w-4 h-4" /> Message sent! We&apos;ll respond within 1 business day.
                  </div>
                )}
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  placeholder="Describe your question or concern..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" />
                <button onClick={sendMessage} disabled={!message.trim()}
                  className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 disabled:opacity-50">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-[11px] text-gray-300 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" /> HIPAA Compliant · Secure Payments · 256-bit Encryption
        </div>
      </div>

      {/* Payment plan modal */}
      {planModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setPlanModal(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">Set Up Payment Plan</h3>
              <p className="text-[12px] text-gray-500 mb-4">Balance: {fmt$(planModal.balance)}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[3, 6, 12].map(m => (
                  <button key={m} onClick={() => setPlanMonths(m)}
                    className={`p-3 rounded-lg border text-center transition-all ${planMonths === m ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="text-[16px] font-bold text-gray-900">{fmt$(Math.ceil(planModal.balance / m))}</p>
                    <p className="text-[10px] text-gray-400">/month × {m}mo</p>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mb-4">No interest. No fees. Auto-pay on the same day each month.</p>
              <div className="flex gap-2">
                <button onClick={() => setupPlan(planModal._id)}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700">
                  Start Plan
                </button>
                <button onClick={() => setPlanModal(null)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-[13px] hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
