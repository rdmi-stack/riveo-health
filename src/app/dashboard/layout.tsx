"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  BarChart3,
  Upload,
  Settings,
  Activity,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Shield,
  Brain,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  Plug,
  Palette,
  CircleDollarSign,
  SearchCheck,
  UserCheck,
  ListChecks,
  BookOpen,
  Radar,
  FileScan,
  ShieldAlert,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/claims", label: "Claims", icon: FileText },
  { href: "/dashboard/denials", label: "Denials", icon: AlertTriangle },
  { href: "/dashboard/resubmit", label: "Auto-Resubmit", icon: RefreshCw },
  { href: "/dashboard/predictions", label: "Denial Prediction", icon: Shield },
  { href: "/dashboard/coding", label: "AI Coding", icon: Brain },
  { href: "/dashboard/prior-auth", label: "Prior Auth", icon: ShieldCheck },
  { href: "/dashboard/chat", label: "Patient Chat", icon: MessageSquare },
  { href: "/dashboard/ehr-connect", label: "EHR Connect", icon: Plug },
  { href: "/dashboard/underpayment", label: "Underpayments", icon: CircleDollarSign },
  { href: "/dashboard/charge-capture", label: "Charge Capture", icon: SearchCheck },
  { href: "/dashboard/patient-billing", label: "Smart Billing", icon: UserCheck },
  { href: "/dashboard/pre-collection", label: "Pre-Collection", icon: ListChecks },
  { href: "/dashboard/payer-rules", label: "Payer Rules", icon: BookOpen },
  { href: "/dashboard/coverage-discovery", label: "Coverage Find", icon: Radar },
  { href: "/dashboard/cdi", label: "CDI Review", icon: FileScan },
  { href: "/dashboard/coding-audit", label: "Coding Audit", icon: ShieldAlert },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/import", label: "Import Data", icon: Upload },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="text-sm font-bold tracking-tight">
              <span className="gradient-text">Riveo</span> Health
            </span>
            <span className="block text-[9px] text-slate-500 tracking-[0.15em] uppercase">Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary-light border border-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-light">
              RH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Demo Practice</p>
              <p className="text-[10px] text-slate-500 truncate">demo@riveohealth.com</p>
            </div>
            <Link href="/" className="text-slate-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search claims, patients, denials..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <Link
              href="/audit"
              className="px-4 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-all"
            >
              Run Audit
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
