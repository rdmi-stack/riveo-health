"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, AlertTriangle, BarChart3, Upload, Settings,
  Activity, LogOut, Bell, Search, Shield, Brain, ShieldCheck,
  MessageSquare, RefreshCw, Plug, CircleDollarSign, SearchCheck, UserCheck,
  ListChecks, BookOpen, Radar, FileScan, ShieldAlert, ChevronDown,
  PanelLeftClose, PanelLeft, Sparkles, HelpCircle,
} from "lucide-react";

const NAV_GROUPS = [
  { label: "Core", items: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/claims", label: "Claims", icon: FileText },
    { href: "/dashboard/denials", label: "Denials", icon: AlertTriangle },
    { href: "/dashboard/resubmit", label: "Auto-Resubmit", icon: RefreshCw },
  ]},
  { label: "AI Engine", items: [
    { href: "/dashboard/predictions", label: "Denial Prediction", icon: Shield },
    { href: "/dashboard/coding", label: "AI Coding", icon: Brain },
    { href: "/dashboard/coding-audit", label: "Coding Audit", icon: ShieldAlert },
    { href: "/dashboard/cdi", label: "CDI Review", icon: FileScan },
    { href: "/dashboard/prior-auth", label: "Prior Auth", icon: ShieldCheck },
  ]},
  { label: "Revenue Recovery", items: [
    { href: "/dashboard/underpayment", label: "Underpayments", icon: CircleDollarSign },
    { href: "/dashboard/charge-capture", label: "Charge Capture", icon: SearchCheck },
    { href: "/dashboard/coverage-discovery", label: "Coverage Discovery", icon: Radar },
    { href: "/dashboard/payer-rules", label: "Payer Rules", icon: BookOpen },
  ]},
  { label: "Patient", items: [
    { href: "/dashboard/chat", label: "Chat Agent", icon: MessageSquare },
    { href: "/dashboard/patient-billing", label: "Smart Billing", icon: UserCheck },
    { href: "/dashboard/pre-collection", label: "Pre-Collection", icon: ListChecks },
  ]},
  { label: "System", items: [
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/ehr-connect", label: "EHR Connect", icon: Plug },
    { href: "/dashboard/import", label: "Import Data", icon: Upload },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]},
];

function useSessionTimeout() {
  const router = useRouter();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const TIMEOUT = 15 * 60 * 1000;
    function resetTimer() { clearTimeout(timer); timer = setTimeout(async () => { await fetch("/api/auth/me", { method: "DELETE" }); router.push("/login?reason=timeout"); }, TIMEOUT); }
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

  useEffect(() => {
    for (const group of NAV_GROUPS) {
      if (group.items.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))) {
        setExpandedGroup(group.label); break;
      }
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar — white with subtle border */}
      <aside className={`${collapsed ? "w-[64px]" : "w-[252px]"} bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300`}>
        {/* Logo */}
        <div className="h-[56px] flex items-center gap-2.5 px-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm">
            <Activity className="w-[18px] h-[18px] text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="text-[14px] font-bold text-gray-900 tracking-tight">Riveo <span className="text-indigo-600">Health</span></span>
              <span className="text-[9px] text-gray-400 tracking-[0.15em] uppercase block">Revenue OS</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedGroup === group.label;
            const hasActive = group.items.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
            return (
              <div key={group.label} className="mb-0.5">
                {!collapsed && (
                  <button onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 hover:text-gray-600 transition-colors">
                    {group.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                )}
                {(collapsed || isExpanded || hasActive) && (
                  <div className="space-y-[1px] px-2">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                          className={`group flex items-center gap-2.5 rounded-lg transition-all duration-150 ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-[8px]"} ${
                            isActive
                              ? "bg-indigo-50 text-indigo-700 font-semibold"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          }`}>
                          <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                          {!collapsed && (
                            <>
                              <span className="text-[13px] truncate">{item.label}</span>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-auto shrink-0" />}
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
        <div className="p-2 border-t border-gray-100">
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all mb-1.5">
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!collapsed && <span className="text-[11px]">Collapse</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">RH</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-700 truncate">Demo Practice</p>
                <p className="text-[10px] text-gray-400 truncate">demo@riveohealth.com</p>
              </div>
              <Link href="/" className="text-gray-300 hover:text-gray-500 transition-colors"><LogOut className="w-[14px] h-[14px]" /></Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[56px] flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2.5 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Search claims, patients, denials..."
              className="w-full bg-transparent text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none" />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] text-gray-400">⌘K</kbd>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-indigo-50 border border-indigo-100">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-semibold text-indigo-600">GPT-5.4</span>
            </div>
            <Link href="/audit" className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all">Run Audit</Link>
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-[17px] h-[17px] text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><HelpCircle className="w-[17px] h-[17px] text-gray-400" /></button>
          </div>
        </header>

        {/* Content — light gray background */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
