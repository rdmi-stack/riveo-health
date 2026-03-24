"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("Dashboard error:", error); }, [error]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Dashboard Error</h2>
        <p className="text-sm text-slate-400 mb-6">Something went wrong loading this page.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
