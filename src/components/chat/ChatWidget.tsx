"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatWidget({ orgId = "demo" }: { orgId?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your billing assistant. I can help with questions about your bills, insurance coverage, payment options, and more. How can I help?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          orgId,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply, timestamp: data.timestamp }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again or call our billing department.", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform z-50">
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[520px] rounded-2xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 gradient-bg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-semibold text-white">Billing Assistant</p>
            <p className="text-[10px] text-white/70">Powered by AI · Available 24/7</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-light" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === "user"
                ? "bg-primary text-white rounded-br-sm"
                : "bg-white/10 text-slate-300 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary-light" />
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/10 rounded-bl-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your bill..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary" />
          <button type="submit" disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-1.5">AI assistant · Not medical advice</p>
      </form>
    </div>
  );
}
