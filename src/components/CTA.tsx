"use client";

import { ArrowRight, CheckCircle, Phone, Zap } from "lucide-react";
import Link from "next/link";

const guarantees = [
  "Free revenue leakage audit",
  "Live in 7 days",
  "No contracts — month-to-month",
  "ROI guaranteed in 30 days",
  "Cancel anytime",
];

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left: Dark side — Value prop */}
        <div className="bg-slate-950 relative px-8 py-20 lg:px-16 lg:py-24 flex flex-col justify-center">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

          <div className="relative max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Ready to start?
              </p>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Every day without AI
              <br />
              <span className="text-cyan-300">is revenue lost.</span>
            </h2>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Get a free revenue leakage audit and see the exact dollar
              amount you&apos;re losing to denials, coding errors, and missed
              follow-ups.
            </p>

            {/* Guarantees */}
            <ul className="mt-8 space-y-3">
              {guarantees.map((g) => (
                <li key={g} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>

            {/* Phone */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                Prefer to talk?
              </p>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <Phone className="w-5 h-5" />
                (555) 123-4567
              </a>
            </div>
          </div>
        </div>

        {/* Right: Gradient side — CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 relative px-8 py-20 lg:px-16 lg:py-24 flex flex-col justify-center items-center text-center">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-md">
            {/* Big number */}
            <div className="mb-8">
              <p className="text-8xl sm:text-9xl font-black text-white/10 leading-none select-none">
                $78K
              </p>
              <p className="text-sm text-indigo-200 -mt-2">
                Average revenue leakage found per audit
              </p>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              How much are you leaving on the table?
            </h3>

            <p className="text-indigo-200 leading-relaxed mb-8">
              Our free audit takes 48 hours and requires zero effort from your
              team. You&apos;ll get a detailed report showing exactly where
              revenue is leaking — and how to fix it.
            </p>

            {/* Primary CTA */}
            <Link
              href="/demo"
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 text-lg font-bold text-indigo-700 bg-white rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl shadow-black/20"
            >
              Get Your Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-4 text-xs text-indigo-300/60">
              No credit card. No commitment. Results in 48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
