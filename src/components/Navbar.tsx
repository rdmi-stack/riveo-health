"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
  MessageSquare,
  BarChart3,
  Brain,
  Plug,
  Shield,
  Building2,
  Stethoscope,
  HandCoins,
  FileCheck,
  BookOpen,
  FileText,
  Users,
  Video,
  Lightbulb,
  ArrowRight,
  Newspaper,
  Award,
  Search,
  Layers,
  Phone,
  Briefcase,
  Heart,
  Globe,
} from "lucide-react";

type MegaMenuId = "platform" | "solutions" | "resources" | "company" | null;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuId>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeMega = () => setActiveMega(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-surface-dark tracking-tight">
                <span className="gradient-text">Riveo</span> Health
              </span>
              <span className="hidden sm:block text-[10px] text-text-secondary -mt-1 tracking-widest uppercase">
                Revenue OS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {(
              [
                { id: "platform" as MegaMenuId, label: "Platform", href: "#platform" },
                { id: "solutions" as MegaMenuId, label: "Solutions", href: "#solutions" },
                { id: "resources" as MegaMenuId, label: "Resources", href: "#" },
                { id: "company" as MegaMenuId, label: "Company", href: "#company" },
              ] as const
            ).map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveMega(item.id)}
                onMouseLeave={closeMega}
                className="relative"
              >
                <button
                  className={`flex items-center gap-1 px-4 py-6 text-sm font-medium transition-colors ${
                    activeMega === item.id
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      activeMega === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Active indicator line */}
                {activeMega === item.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                )}
              </div>
            ))}

            <a
              href="#results"
              className="px-4 py-6 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Results
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </a>
            <Link
              href="/demo"
              className="px-5 py-2.5 text-sm font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              Request a Demo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ===== MEGA MENUS ===== */}
      {activeMega && (
        <div
          className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl"
          onMouseEnter={() => setActiveMega(activeMega)}
          onMouseLeave={closeMega}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Platform Mega Menu */}
            {activeMega === "platform" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Left column - challenges */}
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    Solve your biggest challenges
                  </p>
                  <ul className="space-y-1">
                    {[
                      "Claim Denials",
                      "Revenue Leakage",
                      "Patient Collections",
                      "Coding Accuracy",
                      "Billing Automation",
                      "Payer Follow-ups",
                      "Staff Burnout",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#platform"
                          onClick={closeMega}
                          className="block py-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Middle column - products */}
                <div className="col-span-4 border-l border-gray-100 pl-10">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    Platform
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: MessageSquare,
                        title: "Patient Interaction Agent",
                        desc: "AI chat, voice & messaging",
                      },
                      {
                        icon: BarChart3,
                        title: "Revenue Intelligence",
                        desc: "Claims, denials & collections",
                      },
                      {
                        icon: Brain,
                        title: "AI Decision Engine",
                        desc: "Coding, prediction & automation",
                      },
                      {
                        icon: Plug,
                        title: "Integrations",
                        desc: "EHR, payers & payment gateways",
                      },
                      {
                        icon: Shield,
                        title: "Security & Compliance",
                        desc: "HIPAA, GDPR, SOC 2",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title}>
                          <a
                            href="#platform"
                            onClick={closeMega}
                            className="flex items-start gap-3 group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-text-muted">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Right column - featured card */}
                <div className="col-span-5 pl-10 border-l border-gray-100">
                  <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] flex flex-col justify-between group">
                    <Image
                      src="/demo/healthcare-tech.jpg"
                      alt="AI-powered claim scrubbing"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
                    <div className="relative p-8 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">
                          Featured
                        </p>
                        <h3 className="text-xl font-bold leading-snug mb-3 text-white">
                          See how AI-powered claim scrubbing catches errors before
                          they cost you money
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Our AI validates every claim against payer-specific
                          rules, achieving 97% first-pass acceptance rates.
                        </p>
                      </div>
                      <a
                        href="#platform"
                        onClick={closeMega}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white mt-6 hover:gap-3 transition-all"
                      >
                        See the platform
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Solutions Mega Menu */}
            {activeMega === "solutions" && (
              <div className="grid grid-cols-12 gap-10">
                {/* By organization type */}
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    By Organization Type
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: Building2,
                        title: "Hospitals & Health Systems",
                        desc: "Enterprise revenue optimization",
                      },
                      {
                        icon: Stethoscope,
                        title: "Physician Practices",
                        desc: "Streamlined billing & engagement",
                      },
                      {
                        icon: HandCoins,
                        title: "RCM Companies",
                        desc: "White-label AI capabilities",
                      },
                      {
                        icon: FileCheck,
                        title: "Billing Services",
                        desc: "End-to-end automation",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title}>
                          <a
                            href="#solutions"
                            onClick={closeMega}
                            className="flex items-start gap-3 group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-100 transition-colors">
                              <Icon className="w-5 h-5 text-accent-dark" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-text-muted">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* By challenge */}
                <div className="col-span-3 border-l border-gray-100 pl-10">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    By Challenge
                  </p>
                  <ul className="space-y-1">
                    {[
                      "Reduce Denial Rates",
                      "Accelerate Collections",
                      "Automate Patient Comms",
                      "Improve Coding Accuracy",
                      "Scale Without Hiring",
                      "Revenue Leakage Audit",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#solutions"
                          onClick={closeMega}
                          className="block py-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured card */}
                <div className="col-span-5 pl-10 border-l border-gray-100">
                  <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] flex flex-col justify-between group">
                    <Image
                      src="/demo/team-collab.jpg"
                      alt="Pacific Medical Group case study"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
                    <div className="relative p-8 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-3">
                          Case Study
                        </p>
                        <h3 className="text-xl font-bold leading-snug mb-3 text-white">
                          Pacific Medical Group cut A/R days from 52 to 18 — and
                          recovered $1.2M
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          A 120-physician practice automated follow-ups and
                          denial management with Riveo Health.
                        </p>
                      </div>
                      <a
                        href="#"
                        onClick={closeMega}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white mt-6 hover:gap-3 transition-all"
                      >
                        See the results
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Mega Menu */}
            {activeMega === "resources" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Insights column */}
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    Insights on your biggest challenges
                  </p>
                  <ul className="space-y-1">
                    {[
                      "Claims Denial",
                      "Revenue Leakage",
                      "Collecting Patient Pay",
                      "Healthcare Trends",
                      "Medical Coding & Billing",
                      "Automating RCM",
                      "Growing Your Practice",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={closeMega}
                          className="block py-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources column */}
                <div className="col-span-3 border-l border-gray-100 pl-10">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    Resources
                  </p>
                  <ul className="space-y-3">
                    {[
                      { icon: BookOpen, label: "Blog" },
                      { icon: FileText, label: "Case Studies" },
                      { icon: Users, label: "Customer Success Stories" },
                      { icon: Newspaper, label: "Ebooks & Guides" },
                      { icon: Lightbulb, label: "Our Thought Leaders" },
                      { icon: Video, label: "Webinars" },
                      { icon: Layers, label: "View All Content" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <a
                            href="#"
                            onClick={closeMega}
                            className="flex items-center gap-2.5 text-sm font-medium text-surface-dark hover:text-primary transition-colors"
                          >
                            <Icon className="w-4 h-4 text-text-muted" />
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* For customers column */}
                <div className="col-span-2 border-l border-gray-100 pl-10">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    For Customers
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Client Portal Login",
                      "Patient Bill Pay",
                      "Support Center",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={closeMega}
                          className="text-sm font-medium text-surface-dark hover:text-primary transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm font-semibold text-surface-dark mt-8 mb-5">
                    Get In Touch
                  </p>
                  <ul className="space-y-3">
                    {["Contact Us", "API Documentation"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={closeMega}
                          className="text-sm font-medium text-surface-dark hover:text-primary transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured card */}
                <div className="col-span-4 pl-10 border-l border-gray-100">
                  <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] flex flex-col justify-between group">
                    <Image
                      src="/demo/woman-laptop.jpg"
                      alt="Billing company case study"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
                    <div className="relative p-8 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-3">
                          Case Study
                        </p>
                        <h3 className="text-xl font-bold leading-snug mb-3 text-white">
                          How Riveo Health helped a billing company process 3x more
                          claims without adding staff
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          RevMax Solutions white-labeled Riveo Health to transform
                          their entire business model.
                        </p>
                      </div>
                      <a
                        href="#"
                        onClick={closeMega}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white mt-6 hover:gap-3 transition-all"
                      >
                        See the results
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Mega Menu */}
            {activeMega === "company" && (
              <div className="grid grid-cols-12 gap-10">
                {/* About */}
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    Company
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: Heart,
                        title: "About Riveo Health",
                        desc: "Our mission and vision",
                      },
                      {
                        icon: Briefcase,
                        title: "Careers",
                        desc: "Join our team",
                      },
                      {
                        icon: Award,
                        title: "Why Riveo Health",
                        desc: "What makes us different",
                      },
                      {
                        icon: Globe,
                        title: "Partners",
                        desc: "Partner ecosystem",
                      },
                      {
                        icon: Phone,
                        title: "Contact Us",
                        desc: "Get in touch",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title}>
                          <a
                            href="#company"
                            onClick={closeMega}
                            className="flex items-start gap-3 group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-text-muted">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* News */}
                <div className="col-span-3 border-l border-gray-100 pl-10">
                  <p className="text-sm font-semibold text-surface-dark mb-5">
                    News & Press
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Newsroom",
                      "Press Releases",
                      "Brand Assets",
                      "Events",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={closeMega}
                          className="flex items-center gap-2 text-sm font-medium text-surface-dark hover:text-primary transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm font-semibold text-surface-dark mt-8 mb-5">
                    Trust & Security
                  </p>
                  <ul className="space-y-3">
                    {[
                      "HIPAA Compliance",
                      "Security Practices",
                      "Privacy Policy",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={closeMega}
                          className="text-sm font-medium text-surface-dark hover:text-primary transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured */}
                <div className="col-span-5 pl-10 border-l border-gray-100">
                  <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] flex flex-col justify-between group">
                    <Image
                      src="/demo/meeting.jpg"
                      alt="Join the Riveo Health team"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
                    <div className="relative p-8 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">
                          We&apos;re Hiring
                        </p>
                        <h3 className="text-xl font-bold leading-snug mb-3 text-white">
                          Join the team building the future of healthcare revenue
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          We&apos;re looking for engineers, data scientists, and
                          healthcare domain experts who want to make a real
                          impact.
                        </p>
                      </div>
                      <a
                        href="#"
                        onClick={closeMega}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white mt-6 hover:gap-3 transition-all"
                      >
                        View open roles
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-6 space-y-1">
            {[
              {
                label: "Platform",
                href: "#platform",
                children: [
                  "Patient Interaction Agent",
                  "Revenue Intelligence",
                  "AI Decision Engine",
                  "Integrations",
                  "Security & Compliance",
                ],
              },
              {
                label: "Solutions",
                href: "#solutions",
                children: [
                  "Hospitals & Health Systems",
                  "Physician Practices",
                  "RCM Companies",
                  "Billing Services",
                ],
              },
              {
                label: "Resources",
                href: "#",
                children: [
                  "Blog",
                  "Case Studies",
                  "Webinars",
                  "Ebooks & Guides",
                ],
              },
              {
                label: "Company",
                href: "#company",
                children: [
                  "About",
                  "Careers",
                  "Contact",
                  "Partners",
                ],
              },
            ].map((section) => (
              <div key={section.label}>
                <button
                  onClick={() =>
                    setMobileExpanded(
                      mobileExpanded === section.label
                        ? null
                        : section.label
                    )
                  }
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold text-surface-dark hover:text-primary rounded-lg"
                >
                  {section.label}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === section.label ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {mobileExpanded === section.label && (
                  <div className="pl-6 pb-2 space-y-1">
                    {section.children.map((child) => (
                      <a
                        key={child}
                        href={section.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-primary rounded-lg"
                      >
                        {child}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a
              href="#results"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-base font-semibold text-surface-dark hover:text-primary rounded-lg"
            >
              Results
            </a>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 text-sm font-semibold text-white gradient-bg rounded-full"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
