"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, AlertTriangle, BarChart3, Upload, Settings,
  Activity, LogOut, Bell, Search, ChevronRight, Shield, Brain, ShieldCheck,
  MessageSquare, RefreshCw, Plug, CircleDollarSign, SearchCheck, UserCheck,
  ListChecks, BookOpen, Radar, FileScan, ShieldAlert, ChevronDown,
  PanelLeftClose, PanelLeft, Sparkles, HelpCircle,
} from "lucide-react";

/* ── Nav structure with groups ──────────────────────── */
const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/claims", label: "Claims", icon: FileText },
      { href: "/dashboard/denials", label: "Denials", icon: AlertTriangle },
      { href: "/dashboard/resubmit", label: "Auto-Resubmit", icon: RefreshCw },
    ],
  },
  {
    label: "AI Engine",
    items: [
      { href: "/dashboard/predictions", label: "Denial Prediction", icon: Shield },
      { href: "/dashboard/coding", label: "AI Coding", icon: Brain },
      { href: "/dashboard/coding-audit", label: "Coding Audit", icon: ShieldAlert },
      { href: "/dashboard/cdi", label: "CDI Review", icon: FileScan },
      { href: "/dashboard/prior-auth", label: "Prior Auth", icon: ShieldCheck },
    ],
  },
  {
    label: "Revenue Recovery",
    items: [
      { href: "/dashboard/underpayment", label: "Underpayments", icon: CircleDollarSign },
      { href: "/dashboard/charge-capture", label: "Charge Capture", icon: SearchCheck },
      { href: "/dashboard/coverage-discovery", label: "Coverage Discovery", icon: Radar },
      { href: "/dashboard/payer-rules", label: "Payer Rules", icon: BookOpen },
    ],
  },
  {
    label: "Patient",
    items: [
      { href: "/dashboard/chat", label: "Chat Agent", icon: MessageSquare },
      { href: "/dashboard/patient-billing", label: "Smart Billing", icon: UserCheck },
      { href: "/dashboard/pre-collection", label: "Pre-Collection", icon: ListChecks },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/ehr-connect", label: "EHR Connect", icon: Plug },
      { href: "/dashboard/import", label: "Import Data", icon: Upload },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

/* ── Session timeout (HIPAA 15-min inactivity) ──────── */
function useSessionTimeout() {
  const router = useRouter();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const TIMEOUT = 15 * 60 * 1000;
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await fetch("/api/auth/me", { method: "DELETE" });
        router.push("/login?reason=timeout");
      }, TIMEOUT);
    }
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => { clearTimeout(timer); events.forEach(e => window.removeEventListener(e, resetTimer)); };
  }, [router]);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  useSessionTimeout();

  // Auto-expand the group containing the active route
  useEffect(() => {
    for (const group of NAV_GROUPS) {
      if (group.items.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))) {
        setExpandedGroup(group.label);
        break;
      }
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-[#0B0F1A] overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`${collapsed ? "w-[68px]" : "w-[260px]"} bg-[#0F1423] border-r border-white/[0.06] flex flex-col shrink-0 transition-all duration-300`}>
        {/* Logo */}
        <div className="h-[60px] flex items-center gap-2.5 px-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Activity className="w-[18px] h-[18px] text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <span className="text-[14px] font-bold text-white tracking-tight block">
                Riveo <span className="text-indigo-400">Health</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase block">Revenue OS</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedGroup === group.label;
            const hasActive = group.items.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));

            return (
              <div key={group.label} className="mb-1">
                {/* Group header */}
                {!collapsed && (
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {group.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                )}

                {/* Items */}
                {(collapsed || isExpanded || hasActive) && (
                  <div className="space-y-[2px] px-2">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={`group flex items-center gap-2.5 rounded-lg transition-all duration-150 ${
                            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-[9px]"
                          } ${
                            isActive
                              ? "bg-indigo-500/[0.12] text-indigo-400"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                          {!collapsed && (
                            <>
                              <span className="text-[13px] font-medium truncate">{item.label}</span>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto shrink-0" />}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/[0.06]">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all mb-2"
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-[11px] font-bold text-indigo-300 shrink-0">
                RH
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-200 truncate">Demo Practice</p>
                <p className="text-[10px] text-slate-500 truncate">demo@riveohealth.com</p>
              </div>
              <Link href="/" className="text-slate-600 hover:text-white transition-colors">
                <LogOut className="w-[14px] h-[14px]" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[60px] flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0F1423]/60 backdrop-blur-xl shrink-0">
          {/* Search */}
          <div className="flex items-center gap-2.5 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search claims, patients, denials..."
              className="w-full bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-[10px] text-slate-500">
              ⌘K
            </kbd>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-medium text-indigo-300">GPT-5.4</span>
            </div>

            <Link href="/audit" className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/10 transition-all">
              Run Audit
            </Link>

            <button className="relative p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
              <Bell className="w-[18px] h-[18px] text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </button>

            <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
              <HelpCircle className="w-[18px] h-[18px] text-slate-400" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
