"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Activity, Mic, PhoneOff, Bot, User, Loader2, ArrowRight, Shield, Volume2, Phone, Send } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://riveo-health-api-production.up.railway.app";

const PATIENT = {
  name: "Emily Johnson", id: "PAT-29381",
  bills: [
    { date: "Aug 29, 2026", provider: "Dr. Maria Rodriguez", location: "ABC Medical", service: "Preventive visit", cpt: "99396", billed: 180, insurancePaid: 120, copay: 30, youOwe: 0 },
    { date: "Aug 29, 2026", provider: "Dr. Maria Rodriguez", location: "ABC Medical", service: "Office Visit (Level 3)", cpt: "99213", billed: 75, insurancePaid: 40, copay: 0, youOwe: 20 },
  ],
  insurance: "Aetna Commercial", totalBilled: 255, totalInsurancePaid: 160, alreadyPaid: 30, totalOutstanding: 20,
};

const SUGGESTED = ["Why am I receiving this bill?", "What visits are included?", "What payment options do I have?", "I already paid at the visit...", "My insurance should cover this"];

function fmt$(n: number) { return `$${Math.abs(n).toFixed(2)}`; }

const GREETING = "Hi Emily! I'm your billing assistant at Riveo Health. I can see your account has an outstanding balance of twenty dollars from your visit on August 29th. How can I help you today?";

type CallState = "idle" | "connecting" | "ai_speaking" | "listening" | "processing";

export default function VoiceDemoPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [callActive, setCallActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [showMicHelp, setShowMicHelp] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef(history);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldListenRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef("");

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [history]);

  // Request mic permission on page load
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { stream.getTracks().forEach(t => t.stop()); }) // Got permission, release immediately
      .catch(() => { setShowMicHelp(true); }); // Show help modal
  }, []);

  async function startCall() {
    setCallActive(true); setCallState("connecting"); setHistory([]); setCallDuration(0); shouldListenRef.current = true;
    callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    try { streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { setCallState("idle"); setCallActive(false); setShowMicHelp(true); return; }
    setTimeout(() => { const g = { role: "ai", text: GREETING }; setHistory([g]); historyRef.current = [g]; aiSpeak(GREETING); }, 500);
  }

  function endCall() {
    shouldListenRef.current = false; setCallActive(false); setCallState("idle"); stopListening(); stopSpeaking();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  }

  async function aiSpeak(text: string) {
    setCallState("ai_speaking");
    try {
      const res = await fetch(`${API_BASE}/api/voice`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (data.audioUrl) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = data.audioUrl;
        audioRef.current.onended = () => { if (shouldListenRef.current) startListening(); };
        audioRef.current.onerror = () => browserSpeak(text);
        await audioRef.current.play(); return;
      }
    } catch {}
    browserSpeak(text);
  }

  function browserSpeak(text: string) {
    const s = window.speechSynthesis; if (!s) { if (shouldListenRef.current) startListening(); return; }
    s.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1.0; u.pitch = 1.1;
    u.onend = () => { if (shouldListenRef.current) startListening(); }; s.speak(u);
  }

  function stopSpeaking() { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; } window.speechSynthesis?.cancel(); }

  async function startListening() {
    if (!shouldListenRef.current) return;
    stopSpeaking(); setTranscript(""); lastTranscriptRef.current = ""; setCallState("listening");
    try {
      const keyRes = await fetch(`${API_BASE}/api/deepgram`); const { key } = await keyRes.json(); if (!key) throw new Error("no key");
      const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true&utterance_end_ms=2000&interim_results=true`, ["token", key]);
      socketRef.current = ws;
      ws.onopen = () => {
        if (!streamRef.current) return;
        const mr = new MediaRecorder(streamRef.current, { mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm" });
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (e) => { if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data); };
        mr.start(250);
      };
      ws.onmessage = (event) => {
        const d = JSON.parse(event.data);
        if (d.type === "Results") {
          const t = d.channel?.alternatives?.[0]?.transcript || "";
          if (t) { lastTranscriptRef.current = t; setTranscript(t); if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current); if (d.is_final) silenceTimerRef.current = setTimeout(() => { const f = lastTranscriptRef.current.trim(); if (f && shouldListenRef.current) { stopListening(); sendToAI(f); } }, 1500); }
        }
        if (d.type === "UtteranceEnd") { const f = lastTranscriptRef.current.trim(); if (f && shouldListenRef.current) { stopListening(); sendToAI(f); } }
      };
      ws.onerror = () => fallbackListen();
      ws.onclose = () => { try { mediaRecorderRef.current?.stop(); } catch {} };
    } catch { fallbackListen(); }
  }

  function fallbackListen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!SR) return;
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; lastTranscriptRef.current = t; setTranscript(t); };
    r.onend = () => { const f = lastTranscriptRef.current.trim(); if (f && shouldListenRef.current) sendToAI(f); else if (shouldListenRef.current) setTimeout(() => startListening(), 500); };
    r.onerror = () => { if (shouldListenRef.current) setTimeout(() => startListening(), 500); };
    r.start();
  }

  function stopListening() { if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current); try { socketRef.current?.close(); } catch {} socketRef.current = null; try { mediaRecorderRef.current?.stop(); } catch {} mediaRecorderRef.current = null; }

  async function sendToAI(text: string) {
    if (!text || callState === "processing") return; setCallState("processing"); setTranscript(""); lastTranscriptRef.current = "";
    setHistory(prev => [...prev, { role: "user", text }]);
    try {
      const res = await fetch(`${API_BASE}/api/voice-agent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "handle_call", callerMessage: text, patientId: PATIENT.id, callHistory: historyRef.current.map(h => ({ role: h.role === "ai" ? "assistant" : "user", content: h.text })) }) });
      const data = await res.json(); const reply = data.response || "Could you say that again?";
      setHistory(prev => [...prev, { role: "ai", text: reply }]); aiSpeak(reply);
    } catch { const fb = "I'm having trouble. Could you repeat that?"; setHistory(prev => [...prev, { role: "ai", text: fb }]); aiSpeak(fb); }
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!textInput.trim()) return; stopListening(); stopSpeaking();
    if (!callActive) { setCallActive(true); shouldListenRef.current = true; callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000); setHistory([{ role: "ai", text: GREETING }]); historyRef.current = [{ role: "ai", text: GREETING }]; }
    sendToAI(textInput.trim()); setTextInput("");
  }

  function askSuggested(q: string) { stopListening(); stopSpeaking(); if (!callActive) { setCallActive(true); shouldListenRef.current = true; callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000); setHistory([{ role: "ai", text: GREETING }]); historyRef.current = [{ role: "ai", text: GREETING }]; } sendToAI(q); }

  function formatTime(s: number) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
  const isActive = callState === "ai_speaking" || callState === "listening" || callState === "processing";

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="bg-indigo-600"><div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between"><p className="text-[13px] text-white flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> For healthcare leaders: talk with our AI voice agent — live, right now →</p><Link href="/demo" className="px-4 py-1.5 rounded-lg bg-white text-indigo-600 text-[12px] font-semibold hover:bg-indigo-50">Talk now</Link></div></div>
      <nav className="border-b border-white/[0.06]"><div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center"><Activity className="w-[18px] h-[18px] text-white" /></div><span className="text-[16px] font-bold text-white">Riveo <span className="text-indigo-400">Health</span></span></Link><div className="flex items-center gap-3"><Link href="/login" className="px-4 py-2 text-[13px] text-white border border-white/20 rounded-lg hover:bg-white/5">Login</Link><Link href="/demo" className="px-4 py-2 text-[13px] text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium">Request a Demo</Link></div></div></nav>

      <div className="max-w-6xl mx-auto px-4"><div className="grid lg:grid-cols-2 gap-12 pt-16 pb-16">
        <div className="flex flex-col items-center lg:items-start">
          <h1 className="text-[42px] font-bold text-white leading-[1.1] mb-4 text-center lg:text-left">Try <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Voice AI Agent</span><br/>for Patient Billing</h1>
          <p className="text-[15px] text-slate-400 mb-10 text-center lg:text-left max-w-lg">You&apos;re Emily Johnson, a patient who just received her medical bill. Ask about your charges, payment options, or insurance — <strong className="text-white">press the button and talk.</strong></p>
          <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">{SUGGESTED.map((q, i) => (<button key={i} onClick={() => askSuggested(q)} disabled={callState === "processing"} className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30">&ldquo;{q}&rdquo;</button>))}</div>

          <div className="w-full max-w-md mx-auto lg:mx-0"><div className="flex flex-col items-center">
            <div className="h-16 flex items-center justify-center gap-[2px] mb-4 w-full">{isActive ? Array.from({length:40}).map((_,i) => (<div key={i} className={`w-[3px] rounded-full ${callState==="listening"?"bg-rose-400":callState==="ai_speaking"?"bg-indigo-400":"bg-amber-400"}`} style={{height:`${6+Math.random()*40}px`,animation:`waveBar ${0.2+Math.random()*0.5}s ease-in-out ${i*0.015}s infinite alternate`}}/>)) : callActive ? Array.from({length:40}).map((_,i) => <div key={i} className="w-[3px] h-[3px] rounded-full bg-slate-600"/>) : null}</div>
            {callActive && (<div className="mb-4 text-center"><p className={`text-[13px] font-medium ${callState==="listening"?"text-rose-400":callState==="ai_speaking"?"text-indigo-400":callState==="processing"?"text-amber-400":"text-slate-500"}`}>{callState==="listening"?"Listening...":callState==="ai_speaking"?"Agent is speaking...":callState==="processing"?"Thinking...":callState==="connecting"?"Connecting...":"Connected"}</p>{transcript && callState==="listening" && <p className="text-[12px] text-slate-400 mt-1 italic">&ldquo;{transcript}&rdquo;</p>}<p className="text-[11px] text-slate-600 mt-1">{formatTime(callDuration)}</p></div>)}
            {!callActive ? (<button onClick={startCall} className="w-56 h-16 rounded-2xl bg-amber-400 text-slate-900 font-bold text-[16px] flex items-center justify-center gap-3 shadow-2xl shadow-amber-400/20 hover:bg-amber-300 hover:scale-[1.02] transition-all active:scale-95">Talk to Agent <Mic className="w-5 h-5"/></button>) : (<button onClick={endCall} className="w-56 h-14 rounded-2xl bg-rose-500 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-2xl shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95"><PhoneOff className="w-5 h-5"/> End Call</button>)}
            <form onSubmit={handleTextSubmit} className="mt-4 flex gap-2 w-full max-w-md"><input value={textInput} onChange={e => setTextInput(e.target.value)} placeholder={callActive?"Or type here...":"Type a question to start..."} className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[12px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"/><button type="submit" disabled={!textInput.trim()} className="px-3 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30"><Send className="w-4 h-4"/></button></form>
          </div>
          {history.length > 0 && (<div ref={scrollRef} className="mt-6 max-h-56 overflow-y-auto space-y-3 px-1">{history.map((h,i) => (<div key={i} className={`flex gap-2 ${h.role==="user"?"justify-end":""}`}>{h.role==="ai" && <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-3 h-3 text-indigo-400"/></div>}<div className={`max-w-[85%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${h.role==="user"?"bg-indigo-600 text-white rounded-br-sm":"bg-white/[0.05] text-slate-300 border border-white/[0.06] rounded-bl-sm"}`}>{h.text}</div>{h.role==="user" && <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><User className="w-3 h-3 text-slate-400"/></div>}</div>))}{callState==="processing" && <div className="flex gap-2"><div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0"><Loader2 className="w-3 h-3 text-indigo-400 animate-spin"/></div><div className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] rounded-bl-sm flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 animate-bounce"/><span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 animate-bounce" style={{animationDelay:"0.15s"}}/><span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 animate-bounce" style={{animationDelay:"0.3s"}}/></div></div>}</div>)}</div>
        </div>

        <div className="hidden lg:flex justify-center items-start pt-8"><div><p className="text-[12px] text-slate-500 text-center mb-3">Scroll inside to view Emily&apos;s bill</p><div className="w-[300px] rounded-[32px] bg-slate-900 border-[3px] border-slate-700 overflow-hidden shadow-2xl shadow-black/50"><div className="flex items-center justify-between px-5 pt-2.5 pb-1.5"><span className="text-[11px] text-white font-medium">9:41</span><div className="w-16 h-4 rounded-full bg-black"/><span className="text-[10px] text-white">5G</span></div><div className="bg-indigo-700 px-4 py-3"><p className="text-[13px] font-semibold text-white">Hi Emily, this is your bill</p></div><div className="bg-white px-4 py-3 h-[420px] overflow-y-auto"><h3 className="text-[12px] font-bold text-gray-900 mb-2">Recent visit</h3><div className="space-y-1 text-[10px] mb-3"><div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-900">{PATIENT.bills[0].date}</span></div><div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="text-gray-900">{PATIENT.bills[0].provider}</span></div><div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-900">{PATIENT.bills[0].location}</span></div></div><div className="h-px bg-gray-100 my-2"/><div className="flex justify-between text-[10px] mb-2"><span className="text-gray-500">Insurance</span><span className="text-gray-900">{PATIENT.insurance}</span></div><div className="h-px bg-gray-100 my-2"/><div className="space-y-1 text-[10px]"><div className="flex justify-between"><span className="text-gray-500">Billed</span><span>{fmt$(PATIENT.totalBilled)}</span></div><div className="flex justify-between"><span className="text-gray-500">Insurance paid</span><span className="text-emerald-600">-{fmt$(PATIENT.totalInsurancePaid)}</span></div><div className="flex justify-between"><span className="text-gray-500">Already paid</span><span className="text-emerald-600">-{fmt$(PATIENT.alreadyPaid)}</span></div><div className="flex justify-between font-bold pt-1 border-t border-gray-100"><span>Total outstanding</span><span>{fmt$(PATIENT.totalOutstanding)}</span></div></div><div className="h-px bg-gray-100 my-3"/><h3 className="text-[12px] font-bold text-gray-900 mb-2">Procedures</h3>{PATIENT.bills.map((b,i) => (<div key={i} className="mb-2 border border-gray-100 rounded-lg p-2.5"><p className="text-[10px] font-semibold text-gray-900">{b.service}</p><p className="text-[9px] text-gray-400">CPT: {b.cpt}</p><div className="mt-1.5 space-y-0.5 text-[9px]"><div className="flex justify-between"><span className="text-gray-500">Billed</span><span>{fmt$(b.billed)}</span></div><div className="flex justify-between"><span className="text-gray-500">Insurance paid</span><span className="text-emerald-600">-{fmt$(b.insurancePaid)}</span></div>{b.copay>0 && <div className="flex justify-between"><span className="text-gray-500">Copay paid</span><span className="text-emerald-600">-{fmt$(b.copay)}</span></div>}<div className="flex justify-between font-semibold pt-0.5 border-t border-gray-50"><span>You owe</span><span>{fmt$(b.youOwe)}</span></div></div></div>))}</div></div></div></div>
      </div></div>

      <div className="border-t border-white/[0.06] bg-white/[0.02]"><div className="max-w-4xl mx-auto px-4 py-16 text-center"><h2 className="text-[28px] font-bold text-white mb-3">Ready to elevate your patient billing?</h2><p className="text-slate-400 mb-8 max-w-xl mx-auto">See how practices cut overhead and boost patient satisfaction with 24/7 AI voice support.</p><Link href="/demo" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Book a demo <ArrowRight className="w-5 h-5"/></Link></div></div>
      <div className="border-t border-white/[0.06] py-5"><div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] text-slate-600"><p>&copy; 2026 Riveo Health, Inc.</p><div className="flex gap-4"><Link href="/terms" className="hover:text-slate-400">Terms</Link><Link href="/privacy" className="hover:text-slate-400">Privacy</Link><Link href="/security" className="hover:text-slate-400">Security</Link></div></div></div>

      {/* Mic Permission Modal */}
      {showMicHelp && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowMicHelp(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">Microphone Access Needed</h3>
              <p className="text-[14px] text-gray-500 mb-6">To talk with the AI agent, we need access to your microphone. Please allow it in your browser.</p>

              <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 text-[13px] text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900">How to enable:</p>
                <p>1. Click the <strong>lock icon</strong> 🔒 in the address bar</p>
                <p>2. Find <strong>Microphone</strong> → set to <strong>Allow</strong></p>
                <p>3. <strong>Reload</strong> the page</p>
              </div>

              <p className="text-[12px] text-gray-400 mb-4">Or you can type your questions using the text input below the call button.</p>

              <div className="flex gap-3">
                <button onClick={() => { setShowMicHelp(false); window.location.reload(); }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-[14px] hover:bg-indigo-700">
                  I&apos;ve Allowed It — Reload
                </button>
                <button onClick={() => setShowMicHelp(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-[14px] hover:bg-gray-50">
                  Use Text Instead
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
