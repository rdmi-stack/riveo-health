"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Global error:", error); }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-slate-400 mb-6">An unexpected error occurred. Please try again.</p>
        <button onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 mx-auto">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
