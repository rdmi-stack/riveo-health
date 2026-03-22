"use client";

import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Server,
  Lock,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "/platform" },
      { label: "Patient Interaction", href: "/platform/patient-interaction" },
      { label: "Revenue Intelligence", href: "/platform/revenue-intelligence" },
      { label: "AI Engine", href: "/platform/ai-engine" },
      { label: "Analytics", href: "/platform/analytics" },
      { label: "Integrations", href: "/platform/integrations" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Hospitals & Health Systems", href: "/solutions/hospitals" },
      { label: "Physician Practices", href: "/solutions/practices" },
      { label: "RCM Companies", href: "/solutions/rcm" },
      { label: "Billing Services", href: "/solutions/billing" },
      { label: "Why Riveo Health", href: "/why-riveo" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Support Center", href: "/support" },
      { label: "Security", href: "/security" },
      { label: "API Documentation", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
];

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/company/riveohealth", icon: Linkedin },
  { label: "Twitter", href: "https://x.com/riveohealth", icon: Twitter },
  { label: "YouTube", href: "https://youtube.com/@riveohealth", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Newsletter */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white mb-1">
                Stay ahead in healthcare AI
              </h3>
              <p className="text-sm text-slate-400">
                Monthly insights on revenue optimization, AI trends, and industry benchmarks.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full lg:w-auto gap-3"
            >
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 lg:w-80 px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold text-white">
                  <span className="text-indigo-400">Riveo</span> Health
                </span>
                <span className="block text-[10px] text-slate-500 tracking-[0.2em] uppercase">
                  Revenue OS
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              The AI-native platform that controls patient interactions,
              revenue cycles, and financial flow for healthcare organizations.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 mb-6">
              <a
                href="mailto:hello@riveohealth.com"
                className="flex items-center gap-2.5 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                hello@riveohealth.com
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2.5 text-sm hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                (555) 123-4567
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-slate-500" />
                San Francisco, CA
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/60">
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              { icon: ShieldCheck, label: "SOC 2 Type II" },
              { icon: Lock, label: "HIPAA Compliant" },
              { icon: Server, label: "99.9% Uptime SLA" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-500" />
                  {badge.label}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Riveo Health. All rights
              reserved.
            </p>
            <div className="flex items-center gap-5 text-xs">
              <Link
                href="/privacy"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/hipaa"
                className="text-slate-500 hover:text-white transition-colors"
              >
                HIPAA
              </Link>
              <Link
                href="/security"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
