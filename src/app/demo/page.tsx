"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Phone,
  Zap,
  Play,
  Calendar,
  ChevronDown,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Revenue Leakage Audit",
    desc: "Get a free analysis showing exactly where your revenue is leaking and how much you can recover.",
  },
  {
    icon: Clock,
    title: "30-Minute Personalized Demo",
    desc: "See Riveo Health configured for your specialty, payer mix, and claim volume. No generic slide decks.",
  },
  {
    icon: Zap,
    title: "Custom ROI Projection",
    desc: "Walk away with a detailed projection of revenue recovery, cost savings, and efficiency gains specific to your org.",
  },
];

const processSteps = [
  {
    step: "1",
    title: "Submit your request",
    desc: "Fill out the form and tell us about your organization.",
  },
  {
    step: "2",
    title: "Discovery call",
    desc: "A revenue cycle expert calls within 24 hours to understand your needs.",
  },
  {
    step: "3",
    title: "Live demo",
    desc: "See Riveo Health in action, configured for your workflows and payer mix.",
  },
  {
    step: "4",
    title: "Free audit results",
    desc: "Receive a detailed revenue leakage report with recovery opportunities.",
  },
];

const faqs = [
  {
    q: "How long does the demo take?",
    a: "The live demo is 30 minutes. We'll show you Riveo Health configured for your specialty, walk through a real claim lifecycle, and answer all your questions. No commitment required.",
  },
  {
    q: "What do I need to prepare?",
    a: "Nothing. Our team handles everything. If you want a more tailored demo, you can share your average monthly claim volume and top payers — but it's optional.",
  },
  {
    q: "How quickly can we go live?",
    a: "Most organizations are live within 7 days. We integrate with your existing EHR/PM system — no rip-and-replace. Your team keeps working while we set up in the background.",
  },
  {
    q: "Is there a contract or commitment?",
    a: "No. We offer month-to-month plans with no long-term contracts. You stay because Riveo Health works, not because you're locked in.",
  },
  {
    q: "What about HIPAA compliance?",
    a: "Riveo Health is fully HIPAA compliant with SOC 2 Type II certification, end-to-end encryption, BAA agreements, and role-based access controls. Security is built into every layer.",
  },
];

export default function DemoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    orgType: "",
    claimVolume: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`https://riveo-health-api-production.up.railway.app/api/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.organization,
          organizationType: formData.orgType,
          challenges: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
              {/* Left: headline + trust */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  Book a personalized demo
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  See how much revenue you&apos;re{" "}
                  <span className="text-cyan-300">leaving on the table</span>
                </h1>

                <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
                  Get a free revenue leakage audit and a live demo of Riveo
                  Health tailored to your organization. Discover how much
                  revenue you could recover with AI-powered automation.
                </p>

                {/* What you'll get */}
                <div className="mt-10 space-y-6">
                  {benefits.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.title} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-[15px]">
                            {b.title}
                          </p>
                          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trust row */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    HIPAA Compliant
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Response in 24h
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    7-Day Go-Live
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-[28px] blur-xl" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-surface-dark">
                      Request your demo
                    </h2>
                    <p className="text-sm text-text-secondary mt-1.5">
                      Fill out the form and our team will be in touch within 24
                      hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Smith"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jane@hospital.org"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Organization *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Organization"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    {/* Org type + Claim volume row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Organization Type *
                        </label>
                        <select
                          required
                          value={formData.orgType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orgType: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all appearance-none"
                        >
                          <option value="">Select...</option>
                          <option>Hospital / Health System</option>
                          <option>Physician Practice</option>
                          <option>RCM Company</option>
                          <option>Billing Service</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Monthly Claims
                        </label>
                        <select
                          value={formData.claimVolume}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              claimVolume: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all appearance-none"
                        >
                          <option value="">Select...</option>
                          <option>Under 1,000</option>
                          <option>1,000 - 5,000</option>
                          <option>5,000 - 20,000</option>
                          <option>20,000 - 50,000</option>
                          <option>50,000+</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Anything else we should know?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your biggest revenue cycle challenges..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-bg text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                    >
                      Request My Demo
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-text-muted text-center">
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

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/demo/meeting.jpg"
                    alt="Team collaboration"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-[240px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-600">
                      Live Demo Session
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Revenue leakage detection finds an average of $78K+ in
                    missed charges per audit.
                  </p>
                </div>
              </div>

              {/* Right: Steps */}
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                  How It Works
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight mb-6">
                  From request to results in 4 simple steps
                </h2>
                <p className="text-text-secondary leading-relaxed mb-10">
                  No lengthy sales cycles. No generic demos. We show you
                  exactly how Riveo Health works for your organization — and
                  give you a free revenue audit before you commit to anything.
                </p>

                <div className="space-y-8">
                  {processSteps.map((s, i) => (
                    <div key={s.step} className="flex items-start gap-5 group">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                          {s.step}
                        </div>
                        {i < processSteps.length - 1 && (
                          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-surface-dark">
                          {s.title}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT YOU'LL SEE ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                In Your Demo
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                A demo built around your challenges — not a sales pitch
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  image: "/demo/healthcare-tech.jpg",
                  title: "AI Claim Scrubbing",
                  desc: "Watch our AI validate a real claim against payer rules, catch errors, and fix them — in under 2 seconds.",
                  tag: "Live Demo",
                },
                {
                  image: "/demo/woman-laptop.jpg",
                  title: "Revenue Dashboard",
                  desc: "See real-time visibility into your claims pipeline, denial trends, payer performance, and revenue leakage.",
                  tag: "Interactive",
                },
                {
                  image: "/demo/doctor-tablet.jpg",
                  title: "Patient AI Agent",
                  desc: "Experience the AI agent handling billing queries, insurance verification, and payment collection across channels.",
                  tag: "Live Demo",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary">
                        {item.tag}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="w-7 h-7 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-surface-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY HEALTHCARE LEADERS CHOOSE RIVEO HEALTH ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Why Riveo Health
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Why Healthcare Leaders Choose Riveo Health
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "AI-Native Architecture",
                  desc: "Built from scratch with AI at the core, not bolted onto legacy software.",
                  icon: Zap,
                },
                {
                  title: "7-Day Go-Live",
                  desc: "Integrate with your existing EHR and go live in days, not months.",
                  icon: Clock,
                },
                {
                  title: "Risk-Free Start",
                  desc: "Free revenue audit, month-to-month plans, and ROI guaranteed in 30 days.",
                  icon: Shield,
                },
              ].map((card) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="group bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <CardIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-surface-dark mb-3">
                      {card.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Product capability stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: "97%", label: "Coding Accuracy" },
                { value: "< 7 Days", label: "To Go Live" },
                { value: "40+", label: "EHR Integrations" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {s.value}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Common questions about the demo
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-surface-dark pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to stop leaving
              <br />
              <span className="text-cyan-300">revenue on the table?</span>
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how Riveo Health can transform your revenue cycle —
              recover revenue, automate workflows, and eliminate denial
              headaches.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Request My Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="tel:+15551234567"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call (555) 123-4567
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-indigo-300">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Free audit included
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No commitment
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Results in 24h
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
