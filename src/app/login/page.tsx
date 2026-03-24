"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(data.org?.onboardingComplete ? redirect : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-[28px] blur-xl" />

        <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-bold text-surface-dark tracking-tight">
                  <span className="gradient-text">Riveo</span> Health
                </span>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-dark">Client Login</h1>
            <p className="text-sm text-text-secondary mt-1.5">
              Access your revenue dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email address</label>
              <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@organization.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-surface-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-surface-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-surface-dark transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-white gradient-bg rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sign In
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="my-6 border-t border-gray-100" />

          {/* Not a client */}
          <div className="text-center space-y-3">
            <p className="text-sm text-text-secondary">
              Not a client yet?{" "}
              <Link href="/demo" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Request a demo
              </Link>
            </p>
            <p className="text-sm text-text-secondary">
              or{" "}
              <Link href="/audit" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Run a free revenue audit
              </Link>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
            <Shield className="w-3.5 h-3.5" />
            HIPAA Compliant · SOC 2 · AES-256 Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
