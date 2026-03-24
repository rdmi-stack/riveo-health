"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Bot, User, Clock, BarChart3 } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat?org=demo&limit=20")
      .then(r => r.json())
      .then(d => setConversations(d.conversations || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Patient Chat Agent</h1>
          <p className="text-sm text-slate-400">AI-powered billing assistant for patients — embed on your website or patient portal</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-2xl font-bold text-white">{conversations.length}</p>
          <p className="text-xs text-slate-500">Conversations</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-2xl font-bold text-green-400">24/7</p>
          <p className="text-xs text-slate-500">Availability</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-2xl font-bold text-primary-light">&lt;3s</p>
          <p className="text-xs text-slate-500">Avg Response</p>
        </div>
      </div>

      {/* Embed instructions */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-6">
        <h3 className="font-semibold text-white mb-2">Embed on Your Website</h3>
        <p className="text-sm text-slate-400 mb-3">Add this script to your patient portal or website to enable the billing chat agent:</p>
        <code className="block p-3 rounded-lg bg-black/30 text-xs text-green-400 font-mono overflow-x-auto">
          {`<script src="https://app.riveohealth.com/chat-widget.js" data-org="YOUR_ORG_ID"></script>`}
        </code>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <h3 className="font-semibold text-white mb-2">Live Preview</h3>
        <p className="text-sm text-slate-400 mb-4">Try the chat widget — click the button in the bottom-right corner.</p>
        <div className="h-64 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Chat widget is active</p>
            <p className="text-xs text-slate-600">Click the chat icon at the bottom-right →</p>
          </div>
        </div>
      </div>

      {/* Recent conversations */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold text-white mb-4">Recent Conversations</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No conversations yet. Try the chat widget to see conversations appear here.</p>
        ) : (
          <div className="space-y-3">
            {conversations.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-start gap-3 mb-2">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">{c.userMessage}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Bot className="w-4 h-4 text-primary-light mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-400">{c.aiResponse?.slice(0, 150)}{c.aiResponse?.length > 150 ? "..." : ""}</p>
                </div>
                <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(c.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat widget */}
      <ChatWidget orgId="demo" />
    </div>
  );
}
