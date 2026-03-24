"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Activity, CreditCard, Shield, CheckCircle, Loader2,
  Lock, Clock, DollarSign,
} from "lucide-react";

export default function TextToPayPage() {
  const { token } = useParams();
  const [amount, setAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    setPaying(false);
    setPaid(true);
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-2">Payment Successful</h1>
          <p className="text-[14px] text-gray-500 mb-1">Thank you for your payment of <strong className="text-gray-900">${amount || "0"}</strong></p>
          <p className="text-[12px] text-gray-400 mb-6">Confirmation: PAY-{Date.now().toString(36).toUpperCase()}</p>
          <div className="p-4 rounded-xl bg-white border border-gray-200 mb-6 text-[12px] text-gray-500">
            <p>A receipt has been sent to your email and phone. Your account balance has been updated.</p>
          </div>
          <Link href="/patient-portal" className="text-[13px] text-indigo-600 font-medium hover:text-indigo-700">
            View My Account →
          </Link>
          <div className="mt-8 text-[10px] text-gray-300 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" /> Secure Payment · HIPAA Compliant
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-bold text-gray-900">Riveo <span className="text-indigo-600">Health</span></span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Lock className="w-3 h-3 text-emerald-500" /> Secure
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-8">
        {/* Balance card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center mb-6 shadow-sm">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Amount Due</p>
          <p className="text-[40px] font-bold text-gray-900 mt-1 leading-none">$590</p>
          <p className="text-[12px] text-gray-400 mt-2">Statement #{(token as string)?.slice(0, 12)}</p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-amber-600">
            <Clock className="w-3 h-3" /> Due within 30 days
          </div>
        </div>

        {/* Quick pay options */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[{ label: "Full Amount", value: "590" }, { label: "Half", value: "295" }, { label: "Custom", value: "" }].map((opt, i) => (
            <button key={i} onClick={() => setAmount(opt.value)}
              className={`p-3 rounded-xl border text-center transition-all ${amount === opt.value ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <p className="text-[14px] font-bold text-gray-900">{opt.value ? `$${opt.value}` : "Other"}</p>
              <p className="text-[10px] text-gray-400">{opt.label}</p>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        {amount === "" && (
          <div className="mb-6">
            <label className="text-[11px] text-gray-500 mb-1 block font-medium">Enter Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="number" min={1} placeholder="0.00" onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
        )}

        {/* Payment form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block font-medium">Card Number</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} required
              placeholder="4242 4242 4242 4242" maxLength={19}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block font-medium">Expiry</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} required
                placeholder="MM/YY" maxLength={5}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block font-medium">CVV</label>
              <input value={cvv} onChange={e => setCvv(e.target.value)} required
                placeholder="123" maxLength={4} type="password"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block font-medium">Name on Card</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>

          <button type="submit" disabled={paying || !amount}
            className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold text-[15px] hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
            {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {paying ? "Processing..." : `Pay $${amount || "0"}`}
          </button>
        </form>

        {/* Payment plan link */}
        <div className="mt-4 text-center">
          <Link href="/patient-portal" className="text-[12px] text-indigo-600 font-medium hover:text-indigo-700">
            Need a payment plan? View options →
          </Link>
        </div>

        {/* Trust */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-gray-300">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> HIPAA</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> 256-bit SSL</span>
          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-emerald-400" /> PCI Compliant</span>
        </div>
      </div>
    </div>
  );
}
