"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Activity, Mic, MicOff, Phone, Bot, User, Loader2, ArrowRight,
  Shield, Clock, CheckCircle, CreditCard, MessageSquare,
  FileText, ChevronRight, ChevronDown, Volume2,
} from "lucide-react";

/* ── Patient bill data ──────────────────────────────── */
const PATIENT = {
  name: "Emily Johnson",
  id: "PAT-29381",
  bills: [
    { date: "Aug 29, 2026", provider: "Dr. Maria Rodriguez", location: "ABC Medical", service: "Preventive visit, established patient", cpt: "99396", billed: 180, adjustment: -30, insurancePaid: 120, copay: 30, youOwe: 0 },
    { date: "Aug 29, 2026", provider: "Dr. Maria Rodriguez", location: "ABC Medical", service: "Office Visit (Level 3)", cpt: "99213", billed: 75, adjustment: -15, insurancePaid: 40, copay: 0, youOwe: 20 },
  ],
  insurance: "Aetna Commercial",
  totalBilled: 255, totalAdjustment: -45, totalInsurancePaid: 160, alreadyPaid: 30, totalOutstanding: 20,
};

const SUGGESTED = [
  "I was surprised to get this bill... why am I receiving it?",
  "What visits are included in my total balance?",
  "What kind of payment options do I have?",
  "I thought I already paid something at the visit...",
  "I thought my insurance would cover this...",
];

function fmt$(n: number) { return `$${Math.abs(n).toFixed(2)}`; }

export default function VoiceDemoPage() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: `Hi Emily! I'm your billing assistant. I can see your account has an outstanding balance of ${fmt$(PATIENT.totalOutstanding)}. How can I help you today?` },
  ]);
  const [showBill, setShowBill] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onplay = () => setSpeaking(true);
    audioRef.current.onended = () => setSpeaking(false);
    audioRef.current.onerror = () => setSpeaking(false);
    // Speak greeting
    speak(history[0].text);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  /* ── Text-to-Speech via Resemble AI ───────────────── */
  async function speak(text: string) {
    setSpeaking(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(() => setSpeaking(false));
      } else {
        // Fallback to browser TTS if Resemble fails
        fallbackSpeak(text);
      }
    } catch {
      fallbackSpeak(text);
    }
  }

  function fallbackSpeak(text: string) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    const voices = synth.getVoices();
    const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Karen") || v.lang === "en-US");
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    synth.speak(utterance);
  }

  /* ── Speech-to-Text ───────────────────────────────── */
  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome.");
      return;
    }

    // Stop any ongoing speech
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    window.speechSynthesis?.cancel();
    setSpeaking(false);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => { setListening(true); setTranscript(""); };
    recognition.onresult = (e: any) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setTranscript(t);
    };
    recognition.onend = () => {
      setListening(false);
      // Auto-send if we got a transcript
      if (transcript.trim()) handleSend(transcript.trim());
    };
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  /* ── Send to AI ───────────────────────────────────── */
  const handleSend = useCallback(async (text: string) => {
    if (!text || processing) return;
    setHistory(prev => [...prev, { role: "user", text }]);
    setTranscript("");
    setProcessing(true);

    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "handle_call",
          callerMessage: text,
          patientId: PATIENT.id,
          callHistory: history.map(h => ({ role: h.role === "ai" ? "assistant" : "user", content: h.text })),
        }),
      });
      const data = await res.json();
      const reply = data.response || "I'm sorry, let me transfer you to our billing team.";
      setHistory(prev => [...prev, { role: "ai", text: reply }]);
      speak(reply);
    } catch {
      const fallback = "I'm having a little trouble. Let me connect you with a team member.";
      setHistory(prev => [...prev, { role: "ai", text: fallback }]);
      speak(fallback);
    } finally {
      setProcessing(false);
    }
  }, [history, processing]);

  // Handle transcript on listening end
  useEffect(() => {
    if (!listening && transcript.trim() && !processing) {
      handleSend(transcript.trim());
    }
  }, [listening]);

  function handleSuggested(text: string) {
    handleSend(text);
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Top announcement */}
      <div className="bg-indigo-600">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <p className="text-[13px] text-white">For healthcare leaders: talk with our AI voice agent for patient billing — live, right now →</p>
          </div>
          <Link href="/demo" className="px-4 py-1.5 rounded-lg bg-white text-indigo-600 text-[12px] font-semibold hover:bg-indigo-50 transition-colors">
            Talk to Agent now
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Activity className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[16px] font-bold text-white">Riveo <span className="text-indigo-400">Health</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-slate-400">
            <Link href="/platform" className="hover:text-white transition-colors">AI Voice Agent</Link>
            <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-[13px] text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors">Login</Link>
            <Link href="/demo" className="px-4 py-2 text-[13px] text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium">Request a Demo</Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 pt-20 pb-16">
          {/* Left — Hero + Voice button */}
          <div>
            <h1 className="text-[46px] font-bold text-white leading-[1.1] mb-6">
              Try{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Voice AI Agent</span>
              </span>
              <br />for Patient Billing
            </h1>
            <p className="text-[16px] text-slate-400 mb-10 leading-relaxed max-w-lg">
              You&apos;re Emily Johnson, a patient who just received her medical bill.
              Ask about your charges, payment options, or insurance details —{" "}
              <strong className="text-white">just press the button and talk.</strong>
            </p>

            {/* Suggested questions floating */}
            <div className="flex flex-wrap gap-2 mb-10">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => handleSuggested(q)} disabled={processing || listening}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[12px] text-slate-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40">
                  {q}
                </button>
              ))}
            </div>

            {/* Voice button */}
            <div className="flex flex-col items-center">
              <button
                onClick={listening ? stopListening : startListening}
                disabled={processing}
                className={`relative w-48 h-16 rounded-2xl font-semibold text-[16px] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                  listening
                    ? "bg-rose-500 text-white shadow-rose-500/30 scale-105"
                    : processing
                      ? "bg-slate-700 text-slate-400"
                      : "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-amber-400/20 hover:shadow-amber-400/40 hover:scale-[1.02]"
                }`}
              >
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : listening ? (
                  <><MicOff className="w-5 h-5" /> Stop</>
                ) : speaking ? (
                  <><Volume2 className="w-5 h-5" /> Speaking...</>
                ) : (
                  <><span className="text-[15px]">Talk to Agent</span> <Mic className="w-5 h-5" /></>
                )}
                {/* Pulse ring when listening */}
                {listening && (
                  <>
                    <span className="absolute inset-0 rounded-2xl bg-rose-500 animate-ping opacity-20" />
                    <span className="absolute inset-0 rounded-2xl bg-rose-500 animate-pulse opacity-10" />
                  </>
                )}
              </button>

              {/* Live transcript */}
              {(listening || transcript) && (
                <div className="mt-4 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[13px] text-slate-300 min-h-[40px] max-w-md text-center">
                  {listening && !transcript && <span className="text-slate-500 animate-pulse">Listening...</span>}
                  {transcript && <span>{transcript}</span>}
                </div>
              )}
            </div>

            {/* Conversation history */}
            {history.length > 1 && (
              <div ref={scrollRef} className="mt-8 max-h-48 overflow-y-auto space-y-3 pr-2">
                {history.map((h, i) => (
                  <div key={i} className={`flex gap-2 ${h.role === "user" ? "justify-end" : ""}`}>
                    {h.role === "ai" && <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-3 h-3 text-indigo-400" /></div>}
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[12px] ${h.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white/[0.05] text-slate-300 border border-white/[0.06] rounded-bl-sm"}`}>
                      {h.text}
                    </div>
                    {h.role === "user" && <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><User className="w-3 h-3 text-slate-400" /></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Phone mockup with bill */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[320px] rounded-[36px] bg-slate-900 border-[3px] border-slate-700 overflow-hidden shadow-2xl shadow-black/50">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-slate-900">
                  <span className="text-[12px] text-white font-medium">9:41</span>
                  <div className="w-20 h-5 rounded-full bg-black" />
                  <div className="flex items-center gap-1">
                    <div className="flex gap-px">{[1,2,3,4].map(i => <div key={i} className={`w-[3px] rounded-sm bg-white ${i === 4 ? "h-2.5" : i === 3 ? "h-2" : i === 2 ? "h-1.5" : "h-1"}`} />)}</div>
                    <span className="text-[10px] text-white ml-1">5G</span>
                  </div>
                </div>

                {/* Bill content */}
                <div className="bg-indigo-700 px-5 py-4">
                  <p className="text-[14px] font-semibold text-white">Hi Emily, this is your bill</p>
                </div>

                <div className="bg-white px-5 py-4 h-[460px] overflow-y-auto">
                  <p className="text-[11px] text-gray-500 mb-0.5">Scroll inside to view Emily&apos;s bill</p>

                  {/* Recent visit */}
                  <h3 className="text-[13px] font-bold text-gray-900 mt-3 mb-2">Recent visit</h3>
                  <div className="space-y-1.5 text-[11px] mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-900">{PATIENT.bills[0].date}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="text-gray-900">{PATIENT.bills[0].provider}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-900">{PATIENT.bills[0].location}</span></div>
                  </div>

                  <div className="h-px bg-gray-100 my-3" />

                  <div className="flex justify-between text-[11px] mb-1"><span className="text-gray-500">Insurance</span><span className="text-gray-900">{PATIENT.insurance}</span></div>

                  <div className="h-px bg-gray-100 my-3" />

                  {/* Summary */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between"><span className="text-gray-500">Billed</span><span className="text-gray-900">{fmt$(PATIENT.totalBilled)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Insurance adjustments</span><span className="text-emerald-600">-{fmt$(Math.abs(PATIENT.totalAdjustment))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Insurance paid</span><span className="text-emerald-600">-{fmt$(PATIENT.totalInsurancePaid)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Already paid by you</span><span className="text-emerald-600">-{fmt$(PATIENT.alreadyPaid)}</span></div>
                    <div className="flex justify-between font-bold pt-1 border-t border-gray-100"><span className="text-gray-900">Total amount outstanding</span><span className="text-gray-900">{fmt$(PATIENT.totalOutstanding)}</span></div>
                  </div>

                  <div className="h-px bg-gray-100 my-4" />

                  {/* Procedures */}
                  <h3 className="text-[13px] font-bold text-gray-900 mb-1">Procedures</h3>
                  <p className="text-[10px] text-gray-400 mb-3">Click the procedure to view the details</p>

                  {PATIENT.bills.map((bill, i) => (
                    <div key={i} className="mb-3 border border-gray-100 rounded-lg p-3">
                      <p className="text-[11px] font-semibold text-gray-900">{bill.service}</p>
                      <p className="text-[10px] text-gray-400">CPT/HCPCS Code: {bill.cpt}</p>
                      <div className="mt-2 space-y-1 text-[10px]">
                        <div className="flex justify-between"><span className="text-gray-500">Total billed</span><span className="text-gray-900">{fmt$(bill.billed)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Insurance adjustment</span><span className="text-emerald-600">-{fmt$(Math.abs(bill.adjustment))}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Insurance paid</span><span className="text-emerald-600">-{fmt$(bill.insurancePaid)}</span></div>
                        {bill.copay > 0 && <div className="flex justify-between"><span className="text-gray-500">Already paid by you (copay)</span><span className="text-emerald-600">-{fmt$(bill.copay)}</span></div>}
                        <div className="flex justify-between font-semibold pt-1 border-t border-gray-50"><span className="text-gray-700">Amount you owe</span><span className="text-gray-900">{fmt$(bill.youOwe)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-[32px] font-bold text-white mb-3">Ready to elevate your patient billing?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-[15px]">
            Get a tailored demo of our AI agent. See how practices cut overhead, speed up collections,
            and boost patient satisfaction with 24/7 AI support.
          </p>
          <Link href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-[15px] hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Book a demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] text-slate-600">
          <p>&copy; 2026 Riveo Health, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/security" className="hover:text-slate-400">Security</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
