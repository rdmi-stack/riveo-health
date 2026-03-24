"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Activity, Mic, MicOff, Send, Phone, PhoneOff,
  MessageSquare, Bot, User, Loader2, ArrowRight,
  Shield, Clock, CheckCircle, DollarSign, CreditCard,
  FileText, HelpCircle, ChevronRight,
} from "lucide-react";

/* ── Sample patient bill (Emily Johnson) ────────────── */
const PATIENT = {
  name: "Emily Johnson",
  id: "PAT-29381",
  bills: [
    { date: "Feb 15, 2026", provider: "Dr. Sarah Chen", service: "Office Visit (Level 4)", cpt: "99214", total: 320, insurance: 250, youOwe: 70 },
    { date: "Feb 15, 2026", provider: "Quest Diagnostics", service: "Comprehensive Metabolic Panel", cpt: "80053", total: 180, insurance: 140, youOwe: 40 },
    { date: "Jan 28, 2026", provider: "RadNet Imaging", service: "MRI Knee — Right", cpt: "73721", total: 1850, insurance: 1400, youOwe: 450 },
  ],
  totalBalance: 560,
  insurancePaid: 1790,
  copayPaidAtVisit: 35,
};

const SUGGESTED_QUESTIONS = [
  "I was surprised to get this bill... why am I receiving it?",
  "What visits are included in my total balance?",
  "What kind of payment options do I have?",
  "I thought I already paid something at the visit...",
  "I thought my insurance would cover this...",
  "Can I set up a payment plan?",
  "Why is the MRI so expensive?",
];

function fmt$(n: number) { return `$${n.toLocaleString()}`; }

export default function VoiceDemoPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: `Hi Emily! I'm your billing assistant at Riveo Health. I can see your account has a balance of ${fmt$(PATIENT.totalBalance)} across ${PATIENT.bills.length} services. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: "user" as const, content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "handle_call",
          callerMessage: msg,
          patientId: PATIENT.id,
          callHistory: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble right now. Let me transfer you to our billing team. Please hold." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Activity className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[14px] font-bold text-white">Riveo <span className="text-indigo-400">Health</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="px-4 py-2 text-[12px] font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Request a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Announcement bar */}
      <div className="bg-indigo-600/20 border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-[12px] text-indigo-300">
          <Phone className="w-3.5 h-3.5" />
          For healthcare leaders: talk with our AI voice agent for patient billing — live, right now
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[12px] text-slate-400 mb-6">
          <Bot className="w-4 h-4 text-indigo-400" /> AI Voice Agent — Live Demo
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Try <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Voice AI Agent</span><br />for Patient Billing
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          You&apos;re Emily Johnson, a patient who just received her medical bill.
          Ask about your charges, payment options, or insurance details.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Suggested questions */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-3">Try asking</p>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} disabled={loading}
                  className="shrink-0 text-left px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[12px] text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden backdrop-blur-sm">
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Riveo AI Agent</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active now
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Shield className="w-3 h-3 text-emerald-500" /> HIPAA Compliant
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="h-[420px] overflow-y-auto p-5 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-white/[0.06] text-slate-200 border border-white/[0.06] rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.06] rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-400/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-400/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-400/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-white/10 bg-white/[0.02]">
                <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Type your question as Emily..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20" />
                  <button type="submit" disabled={loading || !input.trim()}
                    className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-40">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-slate-600 text-center mt-2">AI billing assistant · Not medical advice · HIPAA compliant</p>
              </div>
            </div>
          </div>

          {/* Bill preview */}
          <div className="lg:col-span-1 order-3">
            <button onClick={() => setShowBill(!showBill)}
              className="w-full text-left mb-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400 hover:bg-white/10 transition-all flex items-center justify-between">
              <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Emily&apos;s Bill</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showBill ? "rotate-90" : ""}`} />
            </button>

            {showBill && (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
                <div className="text-center pb-3 border-b border-white/10">
                  <p className="text-[12px] font-semibold text-white">{PATIENT.name}</p>
                  <p className="text-[10px] text-slate-500">{PATIENT.id}</p>
                  <p className="text-[22px] font-bold text-white mt-2">{fmt$(PATIENT.totalBalance)}</p>
                  <p className="text-[10px] text-slate-500">Total Balance Due</p>
                </div>
                {PATIENT.bills.map((bill, i) => (
                  <div key={i} className="pb-2 border-b border-white/5 last:border-0 last:pb-0">
                    <p className="text-[11px] text-white font-medium">{bill.service}</p>
                    <p className="text-[10px] text-slate-500">{bill.date} · {bill.provider}</p>
                    <div className="flex justify-between mt-1 text-[10px]">
                      <span className="text-slate-500">Total: {fmt$(bill.total)}</span>
                      <span className="text-emerald-400">Ins: {fmt$(bill.insurance)}</span>
                      <span className="text-white font-semibold">{fmt$(bill.youOwe)}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex justify-between text-[10px]">
                  <span className="text-slate-500">Copay paid at visit</span>
                  <span className="text-emerald-400">{fmt$(PATIENT.copayPaidAtVisit)}</span>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock className="w-3 h-3 text-indigo-400" /> 24/7 availability
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <MessageSquare className="w-3 h-3 text-indigo-400" /> Voice, chat, SMS, email
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <CreditCard className="w-3 h-3 text-indigo-400" /> Take payments in-call
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <CheckCircle className="w-3 h-3 text-indigo-400" /> 70% calls resolved by AI
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to elevate your patient billing?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Get a tailored demo of Riveo AI. See how practices cut overhead, speed up collections,
            and boost patient satisfaction with 24/7 AI support.
          </p>
          <Link href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-[15px] hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Book a Demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] text-slate-600">
          <p>&copy; 2026 Riveo Health. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <Link href="/security" className="hover:text-slate-400">Security</Link>
            <Link href="/hipaa" className="hover:text-slate-400">HIPAA</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
