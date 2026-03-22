"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  HeadphonesIcon,
  Handshake,
  Send,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const subjectOptions = [
  "General Inquiry",
  "Request a Demo",
  "Partnership",
  "Support",
  "Press",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@riveohealth.com",
    href: "mailto:hello@riveohealth.com",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(555) 123-4567",
    href: "tel:+15551234567",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "San Francisco, CA",
    href: null,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon\u2013Fri, 9 am\u20136 pm PT",
    href: null,
    gradient: "from-emerald-500 to-emerald-600",
  },
];

const quickLinks = [
  {
    icon: Calendar,
    title: "Request a Demo",
    desc: "See Riveo Health in action with a personalized walkthrough.",
    href: "/demo",
    accent: "from-indigo-500 to-cyan-500",
  },
  {
    icon: HeadphonesIcon,
    title: "Support Center",
    desc: "Get help with your account or technical questions.",
    href: "/support",
    accent: "from-cyan-500 to-teal-500",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    desc: "Explore partnership and integration opportunities.",
    href: "/partners",
    accent: "from-violet-500 to-indigo-500",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ===== DARK HERO + FORM SECTION ===== */}
        <section className="relative pt-24 overflow-hidden">
          {/* Layered background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-16 right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-24 lg:pb-32">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/[0.12] rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Contact Riveo Health
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
                Let&apos;s start a{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  conversation
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                Whether you&apos;re ready for a demo or just exploring,
                we&apos;d love to hear from you.
              </p>
            </div>

            {/* ===== TWO-COLUMN: FORM + CONTACT CARDS ===== */}
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
              {/* Left: Contact Form (3 cols) */}
              <div className="lg:col-span-3 relative">
                {/* Subtle glow behind the card */}
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 rounded-[2rem] blur-2xl" />

                <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-10 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-surface-dark tracking-tight">
                      Send us a message
                    </h2>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                      Fill out the form and our team will get back to you within
                      24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row: Name + Email */}
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
                          placeholder="you@organization.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Row: Org + Subject */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Organization
                        </label>
                        <input
                          type="text"
                          placeholder="Your organization"
                          value={formData.organization}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              organization: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          Subject *
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all appearance-none pr-10"
                          >
                            <option value="">Select a subject...</option>
                            {subjectOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-slate-50/50 text-sm text-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl gradient-bg text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
                    >
                      Send Message
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

              {/* Right: Contact Info Cards (2 cols) — glassmorphic on dark bg */}
              <div className="lg:col-span-2 space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group relative bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-2xl p-6 flex items-start gap-4 hover:bg-white/[0.1] hover:border-white/[0.18] transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-lg font-bold text-white hover:text-cyan-300 transition-colors truncate block"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-lg font-bold text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Additional trust note */}
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-white/[0.08]">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white">
                      Typical response time:
                    </span>{" "}
                    Our team responds within one business day. For urgent
                    matters, call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== QUICK-ACTION CARDS ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Quick Links
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Looking for something specific?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top gradient accent bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.accent} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-surface-dark mb-3 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-5">
                      {link.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
