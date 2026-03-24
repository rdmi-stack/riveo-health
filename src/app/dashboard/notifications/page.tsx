"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, Loader2, Check, CheckCheck, AlertTriangle, AlertCircle,
  Info, CheckCircle, Trash2, ArrowRight, Filter,
} from "lucide-react";

const SEVERITY_STYLES: Record<string, { icon: React.ElementType; bg: string; text: string; dot: string }> = {
  error: { icon: AlertCircle, bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  success: { icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  info: { icon: Info, bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [seeding, setSeeding] = useState(false);

  async function fetchNotifications() {
    setLoading(true);
    const params = new URLSearchParams({ org: "demo" });
    if (filter === "unread") params.set("unread", "true");
    const res = await fetch(`/api/notifications?${params}`);
    const data = await res.json();
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
    setLoading(false);
  }

  useEffect(() => { fetchNotifications(); }, [filter]);

  async function markRead(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "read" }) });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read_all", orgId: "demo" }) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  async function dismiss(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "dismiss" }) });
    setNotifications(prev => prev.filter(n => n._id !== id));
  }

  async function seedNotifications() {
    setSeeding(true);
    const samples = [
      { type: "denial", title: "CLM-00015 denied by UnitedHealthcare", message: "$450 claim denied — CO-197. Prior authorization was not obtained.", severity: "error", link: "/dashboard/denials" },
      { type: "denial", title: "CLM-00023 denied by Aetna", message: "$180 claim denied — CO-16. Missing information required for adjudication.", severity: "warning", link: "/dashboard/denials" },
      { type: "underpayment", title: "12 underpaid claims detected", message: "$3,240 in potential underpayments found across Medicare and BCBS.", severity: "warning", link: "/dashboard/underpayment" },
      { type: "payment", title: "Payment received: $1,250", message: "Blue Cross Blue Shield paid claim CLM-00008.", severity: "success", link: "/dashboard/claims" },
      { type: "prior_auth", title: "Prior auth expiring in 3 days", message: "Authorization for MRI knee (PAT-0034) expires Friday. Renew now.", severity: "error", link: "/dashboard/prior-auth" },
      { type: "collection", title: "Collection step 4 for PAT-0056", message: "$1,200 balance — payment plan offered via SMS. Awaiting response.", severity: "info", link: "/dashboard/pre-collection" },
      { type: "compliance", title: "Password expiration in 7 days", message: "Your password will expire per security policy. Please update.", severity: "warning", link: "/dashboard/settings" },
      { type: "system", title: "New payer rule detected", message: "UnitedHealthcare updated prior auth requirements for imaging. Rule added to database.", severity: "info", link: "/dashboard/payer-rules" },
      { type: "claim", title: "45 claims ready for submission", message: "Daily batch ready. Review and submit before 5 PM cutoff.", severity: "info", link: "/dashboard/claims" },
      { type: "auth", title: "New login detected", message: "Account accessed from 192.168.1.45. If this wasn't you, change your password.", severity: "info", link: "/dashboard/settings" },
    ];
    for (const s of samples) {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, orgId: "demo" }) });
    }
    await fetchNotifications();
    setSeeding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Notifications</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={seedNotifications} disabled={seeding}
            className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
            {seeding ? "Loading..." : "Load Sample Notifications"}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-all">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-0.5 w-fit">
        {(["all", "unread"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-all ${
              filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {f === "all" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">No notifications</p>
          <p className="text-[13px] text-gray-400 mt-1">
            {filter === "unread" ? "All caught up! No unread notifications." : "Click \"Load Sample Notifications\" to see the notification system."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const style = SEVERITY_STYLES[n.severity] || SEVERITY_STYLES.info;
            const Icon = style.icon;
            return (
              <div key={n._id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-3.5 group transition-all ${
                  n.read ? "border-gray-100" : "border-indigo-100 bg-indigo-50/20"
                }`}>
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${style.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!n.read && <div className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
                    <p className={`text-[13px] font-semibold truncate ${n.read ? "text-gray-600" : "text-gray-900"}`}>{n.title}</p>
                  </div>
                  <p className={`text-[12px] ${n.read ? "text-gray-400" : "text-gray-500"}`}>{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-gray-300">{timeAgo(n.createdAt)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.bg} ${style.text} font-medium`}>{n.type}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {n.link && (
                    <Link href={n.link} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => dismiss(n._id)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
