"use client";

import { Star, Quote, Building2, Heart, Shield, Zap } from "lucide-react";

const stats = [
  { value: "200+", label: "Organizations", icon: Building2 },
  { value: "12M+", label: "Claims Processed", icon: Zap },
  { value: "$340M+", label: "Revenue Recovered", icon: Heart },
  { value: "99.2%", label: "Client Retention", icon: Shield },
];

const testimonials = [
  {
    quote:
      "Riveo Health reduced our denial rate by 62% in the first quarter. The AI agents handle what used to take our team hours — in seconds.",
    author: "Dr. Sarah Mitchell",
    role: "CFO, Metro Health Systems",
    rating: 5,
  },
  {
    quote:
      "We went from processing 500 claims a day to 2,000+ without adding headcount. The ROI was visible within the first month.",
    author: "James Rodriguez",
    role: "VP Revenue Cycle, Pacific Medical Group",
    rating: 5,
  },
  {
    quote:
      "The white-label platform let us offer AI-powered RCM to our clients overnight. It transformed our entire business model.",
    author: "Priya Sharma",
    role: "CEO, RevMax Solutions",
    rating: 5,
  },
];

const logos = [
  { name: "Metro Health", color: "#4F46E5", abbr: "MH" },
  { name: "Pacific Medical", color: "#0891B2", abbr: "PM" },
  { name: "RevMax", color: "#7C3AED", abbr: "RX" },
  { name: "HealthFirst", color: "#059669", abbr: "HF" },
  { name: "MedCore", color: "#DC2626", abbr: "MC" },
  { name: "CarePoint", color: "#D97706", abbr: "CP" },
  { name: "VitalCare", color: "#2563EB", abbr: "VC" },
  { name: "PrimeMed", color: "#7C3AED", abbr: "PM" },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Trusted by Leaders
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Healthcare organizations{" "}
            <span className="gradient-text">love Riveo Health</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 mb-4">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow relative"
            >
              <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-text-secondary leading-relaxed mb-6">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                  {t.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-dark">
                    {t.author}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo cloud */}
        <div className="text-center">
          <p className="text-sm font-semibold text-text-muted mb-2">
            Trusted by 200+ healthcare organizations worldwide
          </p>
          <p className="text-xs text-text-muted/60 mb-8">
            From community clinics to large health systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {logos.map((logo) => (
              <div
                key={logo.name + logo.abbr}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: logo.color }}
                >
                  {logo.abbr}
                </div>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
