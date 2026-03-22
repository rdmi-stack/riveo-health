"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Building2,
  Users,
  Code2,
  Layers,
  DollarSign,
  Megaphone,
  UserCheck,
  CheckCircle,
  Send,
  Handshake,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const partnerTypes = [
  {
    icon: Building2,
    title: "RCM Firms",
    subtitle: "White-Label",
    desc: "White-label our AI platform and offer it to your clients under your brand. Full customization, your logo, your identity.",
    accent: "from-indigo-500 to-indigo-600",
    border: "hover:border-indigo-300/30",
    glow: "group-hover:bg-indigo-500/5",
  },
  {
    icon: Users,
    title: "Healthcare Consultants",
    subtitle: "Referral",
    desc: "Recommend Riveo Health to clients and earn competitive referral commissions with every conversion.",
    accent: "from-cyan-500 to-teal-500",
    border: "hover:border-cyan-300/30",
    glow: "group-hover:bg-cyan-500/5",
  },
  {
    icon: Code2,
    title: "Technology Partners",
    subtitle: "Integration",
    desc: "Integrate with Riveo Health via our APIs and expand your ecosystem with AI-powered revenue cycle tools.",
    accent: "from-violet-500 to-purple-600",
    border: "hover:border-violet-300/30",
    glow: "group-hover:bg-violet-500/5",
  },
];

const benefits = [
  {
    icon: Layers,
    title: "White-label capabilities",
    desc: "Offer our AI-powered platform under your own brand with full customization options.",
    accent: "from-indigo-500 to-indigo-600",
  },
  {
    icon: DollarSign,
    title: "Revenue sharing model",
    desc: "Earn competitive commissions and recurring revenue for every client you bring onboard.",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Megaphone,
    title: "Co-marketing support",
    desc: "Access joint marketing resources, co-branded materials, and campaign support.",
    accent: "from-cyan-500 to-cyan-600",
  },
  {
    icon: UserCheck,
    title: "Dedicated partner CSM",
    desc: "Get a single point of contact who helps you onboard clients and grow your partnership.",
    accent: "from-violet-500 to-violet-600",
  },
];

const steps = [
  {
    num: "01",
    title: "Apply",
    desc: "Fill out the partner application form and tell us about your business and goals.",
    accent: "from-indigo-500 to-indigo-600",
  },
  {
    num: "02",
    title: "Onboard",
    desc: "Our partner team sets you up with training, resources, and dedicated support.",
    accent: "from-cyan-500 to-teal-500",
  },
  {
    num: "03",
    title: "Grow",
    desc: "Start offering Riveo Health to your clients and earn revenue as your partnership scales.",
    accent: "from-violet-500 to-purple-600",
  },
];

const partnerTypeOptions = [
  "RCM Firm",
  "Healthcare Consultant",
  "Technology Partner",
  "Other",
];

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    partnerType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/[0.12] rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
                <Handshake className="w-4 h-4" />
                Partner Program
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
                Partner with{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Riveo Health
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Expand your offerings and grow your business with AI-powered
                healthcare revenue solutions.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#become-a-partner"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl shadow-black/20"
                >
                  Become a Partner
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PARTNER TYPES ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Partnership Models
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Find the right partnership for your business
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {partnerTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.title}
                    className={`group relative bg-white rounded-2xl p-8 border border-gray-100 ${type.border} hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Top accent bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type.accent}`}
                    />
                    {/* Hover glow */}
                    <div
                      className={`absolute inset-0 ${type.glow} transition-colors duration-300`}
                    />

                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.accent} flex items-center justify-center mb-6 shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                        {type.subtitle}
                      </p>
                      <h3 className="text-xl font-bold text-surface-dark mb-3">
                        {type.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== BENEFITS GRID ===== */}
        <section className="py-24 lg:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Why Partner With Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Everything you need to succeed
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-5"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center shrink-0 shadow-md`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-surface-dark mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                How It Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Getting started is simple
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-200 via-cyan-200 to-violet-200" />

              {steps.map((s) => (
                <div key={s.num} className="text-center relative">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${s.accent} flex items-center justify-center mx-auto mb-6 text-white font-extrabold text-2xl shadow-xl relative z-10`}
                  >
                    {s.num}
                  </div>
                  <h3 className="text-xl font-bold text-surface-dark mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA / PARTNER FORM ===== */}
        <section
          id="become-a-partner"
          className="relative py-24 lg:py-28 overflow-hidden"
        >
          {/* Dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/8 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: CTA Text */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/[0.12] rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  Join Our Program
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Ready to grow{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    together?
                  </span>
                </h2>
                <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                  Join the Riveo Health partner program and unlock new revenue
                  streams while delivering cutting-edge AI solutions to your
                  clients.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "No upfront costs or commitments",
                    "Onboarding and training included",
                    "Dedicated partner success team",
                    "Competitive revenue sharing",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-400 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Partner Form */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 rounded-[2rem] blur-2xl" />

                <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-extrabold text-surface-dark">
                      Become a Partner
                    </h3>
                    <p className="text-sm text-text-secondary mt-2">
                      Tell us about your business and we&apos;ll be in touch
                      within 48 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Company *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your company name"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Partner Type *
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.partnerType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                partnerType: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all appearance-none pr-10"
                          >
                            <option value="">Select type...</option>
                            {partnerTypeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your business and partnership goals..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl gradient-bg text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
                    >
                      Submit Application
                      <Send className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-text-muted text-center pt-1">
                      By submitting, you agree to our{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                      . We&apos;ll never share your information.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
