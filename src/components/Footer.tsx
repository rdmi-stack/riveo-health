"use client";

import { Activity, ArrowRight, ShieldCheck, Server, Lock, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    "Patient Interaction Agent",
    "Revenue Intelligence Engine",
    "Decision Engine",
    "Analytics & Insights",
    "Integrations",
  ],
  Solutions: [
    "Hospitals & Health Systems",
    "Physician Practices",
    "RCM Companies",
    "Billing Services",
  ],
  Company: ["About Us", "Careers", "Blog", "Press", "Contact"],
  Resources: [
    "Documentation",
    "API Reference",
    "Case Studies",
    "Webinars",
    "Support",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Newsletter row */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Stay ahead in healthcare AI
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Get monthly insights on revenue optimization, AI trends, and
                product updates.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-3"
            >
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Riveo Health</span>
            </a>
            <p className="text-sm leading-relaxed mb-6">
              The AI-native operating system for healthcare revenue and
              patient interactions.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {[
                { label: "LinkedIn", href: "https://linkedin.com/company/riveohealth", icon: Linkedin },
                { label: "Twitter", href: "https://x.com/riveohealth", icon: Twitter },
                { label: "YouTube", href: "https://youtube.com/@riveohealth", icon: Youtube },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II</span>
            </div>
            <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant</span>
            </div>
            <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Riveo Health. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/hipaa" className="hover:text-white transition-colors">
                HIPAA Compliance
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
