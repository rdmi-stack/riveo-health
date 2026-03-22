"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Revenue Calculator Logic                                           */
/* ------------------------------------------------------------------ */

function useCalculator(monthlyClaimsInput: number) {
  const claims = monthlyClaimsInput;
  const avgClaimValue = 285; // industry average

  // Before Riveo (industry averages)
  const beforeDenialRate = 0.22;
  const beforeDaysAR = 52;
  const beforeCostToCollect = 0.062;
  const beforeStaffHours = claims * 0.025;

  // After Riveo (projected)
  const afterDenialRate = 0.08;
  const afterDaysAR = 18;
  const afterCostToCollect = 0.025;
  const afterStaffHours = claims * 0.008;

  // Revenue impact
  const annualClaims = claims * 12;
  const denialSavings = annualClaims * avgClaimValue * (beforeDenialRate - afterDenialRate);
  const collectionSavings = annualClaims * avgClaimValue * (beforeCostToCollect - afterCostToCollect);
  const staffHoursSaved = (beforeStaffHours - afterStaffHours) * 12;
  const totalAnnualImpact = denialSavings + collectionSavings;

  return {
    before: {
      denialRate: `${(beforeDenialRate * 100).toFixed(0)}%`,
      daysAR: `${beforeDaysAR} days`,
      costToCollect: `${(beforeCostToCollect * 100).toFixed(1)}%`,
      staffHours: `${Math.round(beforeStaffHours)} hrs/mo`,
    },
    after: {
      denialRate: `${(afterDenialRate * 100).toFixed(0)}%`,
      daysAR: `${afterDaysAR} days`,
      costToCollect: `${(afterCostToCollect * 100).toFixed(1)}%`,
      staffHours: `${Math.round(afterStaffHours)} hrs/mo`,
    },
    impact: {
      denialSavings,
      collectionSavings,
      staffHoursSaved,
      totalAnnualImpact,
    },
  };
}

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Results() {
  const [claims, setClaims] = useState(5000);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const calc = useCalculator(claims);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const comparisonRows = [
    {
      label: "Denial Rate",
      icon: AlertTriangle,
      before: calc.before.denialRate,
      after: calc.after.denialRate,
      change: "↓ 64%",
    },
    {
      label: "Days in A/R",
      icon: Clock,
      before: calc.before.daysAR,
      after: calc.after.daysAR,
      change: "↓ 65%",
    },
    {
      label: "Cost to Collect",
      icon: DollarSign,
      before: calc.before.costToCollect,
      after: calc.after.costToCollect,
      change: "↓ 60%",
    },
    {
      label: "Staff Hours",
      icon: TrendingUp,
      before: calc.before.staffHours,
      after: calc.after.staffHours,
      change: "↓ 68%",
    },
  ];

  return (
    <section id="results" ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Results
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Calculate your{" "}
            <span className="gradient-text">revenue recovery</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Enter your monthly claim volume. See exactly how much Riveo Health
            can recover — based on industry benchmarks.
          </p>
        </div>

        {/* Calculator Section */}
        <div className="max-w-5xl mx-auto">
          {/* Slider */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-surface-dark">
                  Monthly Claim Volume
                </p>
                <p className="text-xs text-text-muted">
                  Drag the slider or type a number
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={claims}
                  onChange={(e) =>
                    setClaims(
                      Math.max(100, Math.min(100000, Number(e.target.value) || 100))
                    )
                  }
                  className="w-28 px-4 py-2.5 rounded-xl border border-gray-200 text-center text-lg font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <span className="text-sm text-text-muted">claims/mo</span>
              </div>
            </div>
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={claims}
              onChange={(e) => setClaims(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>100</span>
              <span>10,000</span>
              <span>25,000</span>
              <span>50,000</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            {/* Left: Before / After Comparison */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_120px_120px_80px] gap-0 bg-slate-50 border-b border-gray-100">
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    Metric
                  </p>
                </div>
                <div className="px-4 py-4 text-center border-l border-gray-100">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    Before
                  </p>
                </div>
                <div className="px-4 py-4 text-center border-l border-gray-100">
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest">
                    After
                  </p>
                </div>
                <div className="px-4 py-4 text-center border-l border-gray-100">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    Impact
                  </p>
                </div>
              </div>

              {/* Table Rows */}
              {comparisonRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1fr_120px_120px_80px] gap-0 border-b border-gray-50 last:border-0 transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${i * 100 + 200}ms` }}
                  >
                    <div className="px-6 py-5 flex items-center gap-3">
                      <Icon className="w-4 h-4 text-text-muted shrink-0" />
                      <span className="text-sm font-semibold text-surface-dark">
                        {row.label}
                      </span>
                    </div>
                    <div className="px-4 py-5 text-center border-l border-gray-50 bg-red-50/30">
                      <span className="text-sm font-bold text-red-500">
                        {row.before}
                      </span>
                    </div>
                    <div className="px-4 py-5 text-center border-l border-gray-50 bg-green-50/30">
                      <span className="text-sm font-bold text-green-600">
                        {row.after}
                      </span>
                    </div>
                    <div className="px-4 py-5 text-center border-l border-gray-50">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {row.change}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Source citation */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-gray-100">
                <p className="text-[10px] text-text-muted">
                  Before: Industry averages (MGMA, AMA, HFMA). After: Projected
                  with Riveo Health AI automation.
                </p>
              </div>
            </div>

            {/* Right: Impact Summary */}
            <div className="space-y-4">
              {/* Total Impact Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    Estimated Annual Impact
                  </p>
                </div>
                <p className="text-4xl font-black mt-3">
                  {formatCurrency(calc.impact.totalAnnualImpact)}
                </p>
                <p className="text-sm text-indigo-200 mt-1">
                  Recovered revenue per year
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Denial savings</span>
                    <span className="font-bold">
                      {formatCurrency(calc.impact.denialSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Collection savings</span>
                    <span className="font-bold">
                      {formatCurrency(calc.impact.collectionSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Staff hours saved</span>
                    <span className="font-bold">
                      {Math.round(calc.impact.staffHoursSaved).toLocaleString()} hrs/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* ROI Card */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  ROI at Growth Tier ($1,499/mo)
                </p>
                <p className="text-3xl font-black text-emerald-700">
                  {Math.round(calc.impact.totalAnnualImpact / (1499 * 12))}:1
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  Return on investment
                </p>
                <p className="text-xs text-emerald-500 mt-3">
                  Every $1 spent → ${Math.round(calc.impact.totalAnnualImpact / (1499 * 12))} recovered
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/demo"
                className="group flex items-center justify-center gap-2 w-full px-6 py-4 text-sm font-semibold text-white gradient-bg rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Get your exact numbers — Free audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
