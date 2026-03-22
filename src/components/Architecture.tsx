"use client";

import { useEffect, useRef, useState } from "react";
import {
  Globe,
  Layers,
  Cpu,
  Database,
  Shield,
  ArrowDown,
  Zap,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const layers = [
  {
    icon: Globe,
    title: "Interface",
    subtitle: "Multi-Channel Agents",
    modules: ["Chat", "Voice", "WhatsApp", "Email"],

    color: "#6366F1",
    gradient: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: Layers,
    title: "Application",
    subtitle: "Revenue Engine",
    modules: ["Claims", "Denials", "Payments", "Workflows"],

    color: "#06B6D4",
    gradient: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "Intelligence",
    subtitle: "AI Core",
    modules: ["Coding AI", "Prediction", "Next Action", "NLU"],

    color: "#8B5CF6",
    gradient: "from-violet-500 to-violet-600",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Database,
    title: "Data",
    subtitle: "Unified Platform",
    modules: ["Patient", "Claims", "Payments", "Analytics"],

    color: "#10B981",
    gradient: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Security",
    subtitle: "Enterprise Grade",
    modules: ["HIPAA", "SOC 2", "FHIR", "Encryption"],

    color: "#F59E0B",
    gradient: "from-amber-500 to-amber-600",
    glow: "shadow-amber-500/20",
  },
];

const claimSteps = [
  { label: "Patient submits", time: "0s", color: "#6366F1" },
  { label: "AI validates claim", time: "0.8s", color: "#06B6D4" },
  { label: "Codes generated", time: "1.2s", color: "#8B5CF6" },
  { label: "Scrubbed & submitted", time: "1.8s", color: "#10B981" },
  { label: "Payment received", time: "~18 days", color: "#F59E0B" },
];


/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Architecture() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Auto-play claim journey
          let step = 0;
          const interval = setInterval(() => {
            setActiveStep(step);
            step++;
            if (step >= claimSteps.length) {
              clearInterval(interval);
            }
          }, 600);
          observer.disconnect();
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="architecture"
      ref={sectionRef}
      className="py-24 bg-slate-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4">
            Architecture
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built for scale.{" "}
            <span className="text-cyan-400">Designed for healthcare.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Five layers. One intelligent system. Every claim processed in under 2 seconds.
          </p>
        </div>

        {/* Main Layout: Stack + Journey */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">
          {/* Left: Horizontal Layer Cards */}
          <div className="space-y-4">
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.title}
                  className={`transform transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-12"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div
                    className={`relative bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.06] hover:bg-white/[0.08] transition-all group shadow-lg ${layer.glow}`}
                  >
                    <div className="flex items-center gap-5">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${layer.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold">{layer.title}</h3>
                          <span className="text-xs text-slate-500">
                            {layer.subtitle}
                          </span>
                        </div>
                        {/* Module pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {layer.modules.map((mod) => (
                            <span
                              key={mod}
                              className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-xs font-medium text-slate-300 border border-white/[0.05]"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Colored left accent */}
                    <div
                      className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                  </div>

                  {/* Connector */}
                  {i < layers.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown
                        className={`w-4 h-4 transition-all duration-700 ${
                          isVisible ? "opacity-40 text-slate-600" : "opacity-0"
                        }`}
                        style={{ transitionDelay: `${(i + 1) * 150 + 100}ms` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Claim Journey + Tech Stack */}
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Claim Journey Card */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Live Data Flow
                </p>
              </div>
              <h3 className="text-lg font-bold mb-8">
                A Claim&apos;s Journey
              </h3>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-3 bottom-3 w-px bg-slate-800" />
                <div
                  className="absolute left-3 top-3 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-amber-500 transition-all duration-1000"
                  style={{
                    height: isVisible
                      ? `${Math.min(((activeStep + 1) / claimSteps.length) * 100, 100)}%`
                      : "0%",
                  }}
                />

                <div className="space-y-6">
                  {claimSteps.map((step, i) => {
                    const isActive = i <= activeStep;
                    return (
                      <div key={step.label} className="flex items-center gap-4 relative">
                        {/* Dot */}
                        <div
                          className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                            isActive ? "scale-100" : "scale-75"
                          }`}
                          style={{
                            backgroundColor: isActive ? step.color : "#1E293B",
                            border: `2px solid ${isActive ? step.color : "#334155"}`,
                          }}
                        >
                          {isActive && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`flex-1 flex items-center justify-between transition-all duration-500 ${
                            isActive ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {step.label}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {step.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  End-to-end processing
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  &lt; 2 seconds
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
