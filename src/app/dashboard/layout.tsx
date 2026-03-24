"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, AlertTriangle, BarChart3, Upload, Settings,
  Activity, LogOut, Bell, Search, Shield, Brain, ShieldCheck,
  MessageSquare, RefreshCw, Plug, CircleDollarSign, SearchCheck, UserCheck,
  ListChecks, BookOpen, Radar, FileScan, ShieldAlert, ChevronDown,
  PanelLeftClose, PanelLeft, HelpCircle, CheckCircle, X, Calculator, Send,
  Calendar, ClipboardList, Phone, DollarSign,
} from "lucide-react";

const NAV_GROUPS = [
  { label: "Core", items: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/eligibility", label: "Eligibility", icon: ShieldCheck },
    { href: "/dashboard/estimates", label: "Estimates", icon: Calculator },
    { href: "/dashboard/scheduling", label: "Scheduling", icon: Calendar },
    { href: "/dashboard/check-in", label: "Check-In", icon: ClipboardList },
    { href: "/dashboard/claims", label: "Claims", icon: FileText },
    { href: "/dashboard/claim-scrubber", label: "Claim Scrubber", icon: ShieldAlert },
    { href: "/dashboard/claim-status", label: "Claim Status", icon: RefreshCw },
    { href: "/dashboard/denials", label: "Denials", icon: AlertTriangle },
    { href: "/dashboard/resubmit", label: "Auto-Resubmit", icon: RefreshCw },
    { href: "/dashboard/remittance", label: "Remittance", icon: DollarSign },
  ]},
  { label: "AI Engine", items: [
    { href: "/dashboard/predictions", label: "Denial Prediction", icon: Shield },
    { href: "/dashboard/coding", label: "AI Coding", icon: Brain },
    { href: "/dashboard/coding-audit", label: "Coding Audit", icon: ShieldAlert },
    { href: "/dashboard/cdi", label: "CDI Review", icon: FileScan },
    { href: "/dashboard/prior-auth", label: "Prior Auth", icon: ShieldCheck },
    { href: "/dashboard/voice-agent", label: "Voice Agent", icon: Phone },
  ]},
  { label: "Revenue Recovery", items: [
    { href: "/dashboard/underpayment", label: "Underpayments", icon: CircleDollarSign },
    { href: "/dashboard/charge-capture", label: "Charge Capture", icon: SearchCheck },
    { href: "/dashboard/coverage-discovery", label: "Coverage Discovery", icon: Radar },
    { href: "/dashboard/payer-rules", label: "Payer Rules", icon: BookOpen },
  ]},
  { label: "Patient", items: [
    { href: "/dashboard/chat", label: "Chat Agent", icon: MessageSquare },
    { href: "/dashboard/statements", label: "Statements", icon: Send },
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  useSessionTimeout();

  // Fetch notifications
  useEffect(() => {
    fetch("/api/notifications?org=demo&limit=15")
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications || []); setUnreadCount(d.unreadCount || 0); })
      .catch(() => {});
  }, [notifOpen]);

  async function markRead(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "read" }) });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "read_all", orgId: "demo" }) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  async function dismissNotif(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "dismiss" }) });
    setNotifications(prev => prev.filter(n => n._id !== id));
  }

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
            <Link href="/audit" className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all">Run Audit</Link>
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-[17px] h-[17px] text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><HelpCircle className="w-[17px] h-[17px] text-gray-400" /></button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>

      {/* ── Notification Slideout ─────────────────────── */}
      {notifOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setNotifOpen(false)} />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-[380px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">Notifications</h3>
                <p className="text-[11px] text-gray-400">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-indigo-600 font-medium hover:text-indigo-700">Mark all read</button>
                )}
                <button onClick={() => setNotifOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <Bell className="w-8 h-8 text-gray-200 mb-3" />
                  <p className="text-[13px] text-gray-500">No notifications yet</p>
                  <p className="text-[11px] text-gray-300 mt-1">Alerts for denials, payments, and compliance will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => {
                    const colors: Record<string, string> = {
                      error: "bg-rose-50 text-rose-600",
                      warning: "bg-amber-50 text-amber-600",
                      success: "bg-emerald-50 text-emerald-600",
                      info: "bg-blue-50 text-blue-600",
                    };
                    const c = colors[n.severity] || colors.info;
                    const diff = Date.now() - new Date(n.createdAt).getTime();
                    const mins = Math.floor(diff / 60000);
                    const time = mins < 1 ? "Now" : mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.floor(mins / 60)}h` : `${Math.floor(mins / 1440)}d`;

                    return (
                      <div key={n._id}
                        className={`px-5 py-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer group ${!n.read ? "bg-indigo-50/30" : ""}`}
                        onClick={() => { if (!n.read) markRead(n._id); if (n.link) { setNotifOpen(false); window.location.href = n.link; } }}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-lg ${c} flex items-center justify-center shrink-0 mt-0.5`}>
                            {n.severity === "error" ? <AlertTriangle className="w-3.5 h-3.5" /> :
                             n.severity === "warning" ? <AlertTriangle className="w-3.5 h-3.5" /> :
                             n.severity === "success" ? <CheckCircle className="w-3.5 h-3.5" /> :
                             <Bell className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                              <p className={`text-[12px] font-semibold truncate ${n.read ? "text-gray-500" : "text-gray-900"}`}>{n.title}</p>
                            </div>
                            <p className={`text-[11px] mt-0.5 line-clamp-2 ${n.read ? "text-gray-300" : "text-gray-400"}`}>{n.message}</p>
                            <span className="text-[10px] text-gray-300 mt-1 block">{time}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); dismissNotif(n._id); }}
                            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 text-gray-300 hover:text-gray-500 transition-all shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100">
              <Link href="/dashboard/notifications" onClick={() => setNotifOpen(false)}
                className="block text-center text-[12px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
