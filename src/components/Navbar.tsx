"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Phone,
  Briefcase,
  Heart,
  Globe,
  Layers,
} from "lucide-react";

type MegaMenuId = "platform" | "solutions" | "resources" | "company" | null;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuId>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Delay close so user can move mouse to mega menu
  const openMega = useCallback((id: MegaMenuId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMega(id);
  }, []);

  const closeMega = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  }, []);

  const keepOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const closeNow = useCallback(() => {
    setActiveMega(null);
  }, []);

  const navItems: { id: MegaMenuId; label: string }[] = [
    { id: "platform", label: "Platform" },
    { id: "solutions", label: "Solutions" },
    { id: "resources", label: "Resources" },
    { id: "company", label: "Company" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || activeMega
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-white/80 backdrop-blur-xl border-b border-gray-100/50"
        }`}
      >
        {/* Top utility bar */}
        <div className="hidden lg:block bg-slate-900 text-slate-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
            <div className="flex items-center gap-6 text-xs">
              <a href="tel:+15551234567" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3 h-3" />
                (555) 123-4567
              </a>
              <span className="w-px h-3 bg-slate-700" />
              <a href="mailto:hello@riveohealth.com" className="hover:text-white transition-colors">
                hello@riveohealth.com
              </a>
            </div>
            <div className="flex items-center gap-5 text-xs">
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
              <span className="w-px h-3 bg-slate-700" />
              <Link href="/login" className="hover:text-white transition-colors">
                Client Login
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-bold text-surface-dark tracking-tight">
                  <span className="gradient-text">Riveo</span> Health
                </span>
                <span className="hidden sm:block text-[10px] text-text-muted tracking-[0.2em] uppercase">
                  Revenue OS
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center h-full">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.id)}
                  onMouseLeave={closeMega}
                >
                  <button
                    className={`flex items-center gap-1 px-5 h-full text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                      activeMega === item.id
                        ? "text-primary"
                        : "text-surface-dark hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeMega === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeMega === item.id && (
                    <div className="absolute bottom-0 left-5 right-5 h-[3px] bg-primary rounded-t-full" />
                  )}
                </div>
              ))}
              <a
                href="#results"
                className="flex items-center px-5 h-full text-[13px] font-semibold uppercase tracking-wide text-surface-dark hover:text-primary transition-colors"
              >
                Results
              </a>
            </div>

            {/* Right side CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="p-2.5 rounded-full text-text-secondary hover:text-primary hover:bg-primary/5 transition-all">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <Link
                href="/demo"
                className="ml-2 px-6 py-2.5 text-sm font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                Request a Demo
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-text-secondary hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ===== MEGA MENU PANEL ===== */}
        {activeMega && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl shadow-black/10"
            onMouseEnter={keepOpen}
            onMouseLeave={closeMega}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* ---- PLATFORM ---- */}
              {activeMega === "platform" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-3">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      Solve Your Challenges
                    </p>
                    <ul className="space-y-0.5">
                      {[
                        { label: "Claim Denials", href: "/platform/revenue-intelligence" },
                        { label: "Revenue Leakage", href: "/platform/analytics" },
                        { label: "Patient Collections", href: "/platform/patient-interaction" },
                        { label: "Coding Accuracy", href: "/platform/ai-engine" },
                        { label: "Billing Automation", href: "/platform/revenue-intelligence" },
                        { label: "Payer Follow-ups", href: "/platform/revenue-intelligence" },
                        { label: "Staff Burnout", href: "/platform/patient-interaction" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeNow}
                            className="block py-2 text-sm font-medium text-surface-dark hover:text-primary hover:pl-1 transition-all"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 border-l border-gray-100 pl-10">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      Platform Modules
                    </p>
                    <ul className="space-y-3">
                      {[
                        { icon: MessageSquare, title: "Patient Interaction Agent", desc: "AI chat, voice & messaging", href: "/platform/patient-interaction" },
                        { icon: BarChart3, title: "Revenue Intelligence", desc: "Claims, denials & collections", href: "/platform/revenue-intelligence" },
                        { icon: Brain, title: "AI Decision Engine", desc: "Coding, prediction & automation", href: "/platform/ai-engine" },
                        { icon: Plug, title: "Integrations", desc: "EHR, payers & payment gateways", href: "/platform/integrations" },
                        { icon: Shield, title: "Security & Compliance", desc: "HIPAA, GDPR, SOC 2", href: "/security" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.title}>
                            <Link
                              href={item.href}
                              onClick={closeNow}
                              className="flex items-start gap-3 group/item p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">
                                  {item.title}
                                </p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-span-5 pl-10 border-l border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[300px] group">
                      <Image src="/demo/healthcare-tech.jpg" alt="Platform" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">Featured</p>
                        <h3 className="text-lg font-bold text-white leading-snug mb-2">
                          See how AI-powered claim scrubbing catches errors before they cost you money
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          97% first-pass acceptance rates across all payer types.
                        </p>
                        <Link href="/platform" onClick={closeNow} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all">
                          See the platform <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- SOLUTIONS ---- */}
              {activeMega === "solutions" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      By Organization Type
                    </p>
                    <ul className="space-y-2">
                      {[
                        { icon: Building2, title: "Hospitals & Health Systems", desc: "Enterprise revenue optimization", color: "bg-indigo-50", tc: "text-indigo-600", href: "/solutions/hospitals" },
                        { icon: Stethoscope, title: "Physician Practices", desc: "Streamlined billing & engagement", color: "bg-cyan-50", tc: "text-cyan-600", href: "/solutions/practices" },
                        { icon: HandCoins, title: "RCM Companies", desc: "White-label AI capabilities", color: "bg-violet-50", tc: "text-violet-600", href: "/solutions/rcm" },
                        { icon: FileCheck, title: "Billing Services", desc: "End-to-end automation", color: "bg-amber-50", tc: "text-amber-600", href: "/solutions/billing" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.title}>
                            <Link href={item.href} onClick={closeNow} className="flex items-start gap-3 group/item p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors">
                              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${item.tc}`} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">{item.title}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-span-3 border-l border-gray-100 pl-10">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      By Challenge
                    </p>
                    <ul className="space-y-0.5">
                      {[
                        { label: "Reduce Denial Rates", href: "/platform/revenue-intelligence" },
                        { label: "Accelerate Collections", href: "/platform/revenue-intelligence" },
                        { label: "Automate Patient Comms", href: "/platform/patient-interaction" },
                        { label: "Improve Coding Accuracy", href: "/platform/ai-engine" },
                        { label: "Scale Without Hiring", href: "/solutions/rcm" },
                        { label: "Revenue Leakage Audit", href: "/demo" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeNow} className="block py-2 text-sm font-medium text-surface-dark hover:text-primary hover:pl-1 transition-all">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-5 pl-10 border-l border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[300px] group">
                      <Image src="/demo/team-collab.jpg" alt="Free audit" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">Free Audit</p>
                        <h3 className="text-lg font-bold text-white leading-snug mb-2">
                          See exactly where your revenue is leaking — before you commit to anything
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          Get a free revenue leakage analysis showing denial patterns, missed charges, and collection gaps specific to your organization.
                        </p>
                        <Link href="/demo" onClick={closeNow} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all">
                          Get your free audit → <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- RESOURCES ---- */}
              {activeMega === "resources" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-3">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      Topics
                    </p>
                    <ul className="space-y-0.5">
                      {["Claims Denial", "Revenue Leakage", "Collecting Patient Pay", "Healthcare Trends", "Medical Coding & Billing", "Automating RCM", "Growing Your Practice"].map((item) => (
                        <li key={item}>
                          <Link href="/blog" onClick={closeNow} className="block py-2 text-sm font-medium text-surface-dark hover:text-primary hover:pl-1 transition-all">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-3 border-l border-gray-100 pl-10">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      Resources
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        { icon: BookOpen, label: "Blog" },
                        { icon: FileText, label: "Case Studies" },
                        { icon: Users, label: "Customer Stories" },
                        { icon: Newspaper, label: "Ebooks & Guides" },
                        { icon: Lightbulb, label: "Thought Leadership" },
                        { icon: Video, label: "Webinars" },
                        { icon: Layers, label: "View All Content" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.label}>
                            <Link href="/blog" onClick={closeNow} className="flex items-center gap-2.5 text-sm font-medium text-surface-dark hover:text-primary transition-colors group/item">
                              <Icon className="w-4 h-4 text-text-muted group-hover/item:text-primary transition-colors" />
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-span-2 border-l border-gray-100 pl-10">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      For Customers
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        { label: "Client Portal Login", href: "/login" },
                        { label: "Patient Bill Pay", href: "#" },
                        { label: "Support Center", href: "/support" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeNow} className="text-sm font-medium text-surface-dark hover:text-primary transition-colors">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-8 mb-5">
                      Get In Touch
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        { label: "Contact Us", href: "/contact" },
                        { label: "API Docs", href: "#" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeNow} className="text-sm font-medium text-surface-dark hover:text-primary transition-colors">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 pl-10 border-l border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[300px] group">
                      <Image src="/demo/woman-laptop.jpg" alt="Resources" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300 mb-2">New Guide</p>
                        <h3 className="text-lg font-bold text-white leading-snug mb-2">
                          The 2026 guide to AI-powered revenue cycle management
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          Everything healthcare leaders need to know about AI in RCM — from coding automation to denial prediction.
                        </p>
                        <Link href="/blog" onClick={closeNow} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all">
                          Download the guide → <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- COMPANY ---- */}
              {activeMega === "company" && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      Company
                    </p>
                    <ul className="space-y-2">
                      {[
                        { icon: Heart, title: "About Riveo Health", desc: "Our mission and vision", href: "/about" },
                        { icon: Briefcase, title: "Careers", desc: "Join our growing team", href: "/careers" },
                        { icon: Award, title: "Why Riveo Health", desc: "What makes us different", href: "/why-riveo" },
                        { icon: Globe, title: "Partners", desc: "Partner ecosystem", href: "/partners" },
                        { icon: Phone, title: "Contact Us", desc: "Get in touch", href: "/contact" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.title}>
                            <Link href={item.href} onClick={closeNow} className="flex items-start gap-3 group/item p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-surface-dark group-hover/item:text-primary transition-colors">{item.title}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-span-3 border-l border-gray-100 pl-10">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">
                      News & Press
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        { label: "Newsroom", href: "/newsroom" },
                        { label: "Press Releases", href: "/newsroom" },
                        { label: "Brand Assets", href: "#" },
                        { label: "Events", href: "#" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeNow} className="text-sm font-medium text-surface-dark hover:text-primary transition-colors">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-8 mb-5">
                      Trust & Security
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        { label: "HIPAA Compliance", href: "/hipaa" },
                        { label: "Security Practices", href: "/security" },
                        { label: "Privacy Policy", href: "/privacy" },
                      ].map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={closeNow} className="text-sm font-medium text-surface-dark hover:text-primary transition-colors">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-5 pl-10 border-l border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[300px] group">
                      <Image src="/demo/meeting.jpg" alt="Careers" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-2">We&apos;re Hiring</p>
                        <h3 className="text-lg font-bold text-white leading-snug mb-2">
                          Build the future of healthcare revenue with us
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          We&apos;re looking for engineers, data scientists, and healthcare experts.
                        </p>
                        <Link href="/careers" onClick={closeNow} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all">
                          View open roles → <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mega menu backdrop overlay */}
      {activeMega && (
        <div
          className="fixed inset-0 bg-black/20 z-40 hidden lg:block"
          onClick={closeNow}
          style={{ top: "105px" }}
        />
      )}

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          {/* Slide-in panel */}
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-surface-dark">
                  <span className="gradient-text">Riveo</span> Health
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-50">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="px-4 py-5 space-y-1">
              {[
                { label: "Platform", href: "#platform", children: [
                  { label: "Patient Interaction Agent", href: "#platform" },
                  { label: "Revenue Intelligence", href: "#platform" },
                  { label: "AI Decision Engine", href: "#platform" },
                  { label: "Integrations", href: "#platform" },
                  { label: "Security & Compliance", href: "#platform" },
                ] },
                { label: "Solutions", href: "#solutions", children: [
                  { label: "Hospitals & Health Systems", href: "#solutions" },
                  { label: "Physician Practices", href: "#solutions" },
                  { label: "RCM Companies", href: "#solutions" },
                  { label: "Billing Services", href: "#solutions" },
                ] },
                { label: "Resources", href: "/blog", children: [
                  { label: "Blog", href: "/blog" },
                  { label: "Case Studies", href: "/blog" },
                  { label: "Webinars", href: "/blog" },
                  { label: "Ebooks & Guides", href: "/blog" },
                ] },
                { label: "Company", href: "/about", children: [
                  { label: "About", href: "/about" },
                  { label: "Careers", href: "/careers" },
                  { label: "Contact", href: "/contact" },
                  { label: "Partners", href: "/partners" },
                ] },
              ].map((section) => (
                <div key={section.label} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === section.label ? null : section.label)}
                    className="flex items-center justify-between w-full px-3 py-3.5 text-[15px] font-semibold text-surface-dark"
                  >
                    {section.label}
                    <ChevronRight
                      className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                        mobileExpanded === section.label ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {mobileExpanded === section.label && (
                    <div className="pl-4 pb-3 space-y-0.5">
                      {section.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-text-secondary hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a
                href="#results"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3.5 text-[15px] font-semibold text-surface-dark hover:text-primary"
              >
                Results
              </a>
            </div>

            <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-3">
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 text-sm font-semibold text-white gradient-bg rounded-xl shadow-lg"
              >
                Request a Demo
              </Link>
              <div className="flex items-center justify-center gap-4 text-xs text-text-muted pt-2">
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">(555) 123-4567</a>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <Link href="/login" className="hover:text-primary transition-colors">Client Login</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
