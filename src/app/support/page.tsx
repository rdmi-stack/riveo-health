"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Search,
  BookOpen,
  FileText,
  Plug,
  Settings,
  Brain,
  Code,
  Mail,
  Phone,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Setup guides, onboarding resources, and first-steps walkthroughs",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    borderColor: "group-hover:border-indigo-200",
  },
  {
    icon: FileText,
    title: "Billing & Claims",
    description: "Claim submission, denial management, and payment tracking",
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
    borderColor: "group-hover:border-cyan-200",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "EHR/PM system connections, data migration, and sync setup",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "group-hover:border-violet-200",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "User management, permissions, roles, and security preferences",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "group-hover:border-amber-200",
  },
  {
    icon: Brain,
    title: "AI Features",
    description: "Auto-coding, denial prediction, claim scrubbing, and patient agent",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "group-hover:border-emerald-200",
  },
  {
    icon: Code,
    title: "API Docs",
    description: "Developer documentation, webhooks, SDKs, and code samples",
    color: "bg-rose-50",
    iconColor: "text-rose-600",
    borderColor: "group-hover:border-rose-200",
  },
];

const contactCards = [
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@riveohealth.com",
    sub: "Response within 4 hours",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accent: "border-t-indigo-500",
  },
  {
    icon: Phone,
    title: "Phone Support",
    detail: "(555) 123-4567",
    sub: "Mon-Fri 9am-6pm PT",
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accent: "border-t-cyan-500",
  },
  {
    icon: AlertTriangle,
    title: "Emergency",
    detail: "HIPAA incidents or critical system issues",
    sub: "24/7 hotline available",
    color: "bg-red-50",
    iconColor: "text-red-600",
    accent: "border-t-red-500",
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      'Navigate to the login page and click "Forgot Password." Enter the email address associated with your account and you will receive a password reset link within a few minutes. If you do not receive the email, check your spam folder or contact support.',
  },
  {
    question: "How do I add a new user to my organization?",
    answer:
      'Go to Account Settings > User Management and click "Invite User." Enter the new user\'s email address and assign their role and permissions. They will receive an invitation email to create their account and join your organization.',
  },
  {
    question: "How do I connect my EHR system?",
    answer:
      "Navigate to Integrations in the platform dashboard. Select your EHR system from the list of supported integrations and follow the step-by-step connection wizard. Most EHR connections can be completed in under 15 minutes. If you need assistance, our integrations team is available to help.",
  },
  {
    question: "What file formats are supported for claim imports?",
    answer:
      "We support ANSI X12 837 (Professional and Institutional), CSV, Excel (.xlsx), and HL7 FHIR formats for claim imports. Files can be uploaded directly through the platform or sent via our secure API. Batch imports of up to 10,000 claims are supported per upload.",
  },
  {
    question: "How do I contact my account manager?",
    answer:
      'Your dedicated account manager\'s contact information is available in the Account Settings section under "Your Team." You can also reach them by emailing support@riveohealth.com with your organization name and they will route your request accordingly.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-24 overflow-hidden">
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

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              How can we help?
            </h1>
            <p className="mt-5 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find answers, get in touch, or browse our resources to make the
              most of Riveo Health.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, and more..."
                className="w-full pl-14 pr-5 py-4.5 rounded-2xl bg-white text-surface-dark text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-2xl shadow-black/10 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="relative -mt-6 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`group relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg ${item.borderColor} transition-all duration-300 cursor-pointer`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-dark group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse articles
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Contact
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-dark tracking-tight">
                Get in touch with support
              </h2>
              <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
                Our team is here to help you succeed
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`bg-white rounded-2xl p-7 border border-gray-100 border-t-4 ${item.accent} text-center hover:shadow-lg transition-all duration-300`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-5`}
                    >
                      <Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-surface-dark">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-surface-dark">
                      {item.detail}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {item.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-dark tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-text-secondary text-lg">
                Quick answers to common questions
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex items-center justify-between w-full px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-surface-dark pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
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
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Still need help?
            </h2>
            <p className="mt-4 text-lg text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Our support team is available to assist you with any questions or
              issues you may have.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:support@riveohealth.com"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
