"use client";
import { useState, useEffect } from "react";
import { Calendar, Loader2, CheckCircle, Clock, User, Bell, AlertTriangle } from "lucide-react";

export default function SchedulingPage() {
  const [appts, setAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({ total: 0, todayCount: 0, upcoming: 0, noShows: 0 });
  const [sending, setSending] = useState(false);

  async function fetchData() { setLoading(true); const r = await fetch("/api/scheduling?org=demo"); const d = await r.json(); setAppts(d.appointments || []); setStats({ total: d.total || 0, todayCount: d.todayCount || 0, upcoming: d.upcoming || 0, noShows: d.noShows || 0 }); setLoading(false); }
  useEffect(() => { fetchData(); }, []);
  async function seed() { setSeeding(true); await fetch("/api/scheduling", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) }); await fetchData(); setSeeding(false); }
  async function sendReminders() { setSending(true); await fetch("/api/scheduling", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send_reminders" }) }); await fetchData(); setSending(false); }

  const STATUS_STYLES: Record<string, string> = { scheduled: "bg-blue-50 text-blue-700", checked_in: "bg-indigo-50 text-indigo-700", completed: "bg-emerald-50 text-emerald-700", cancelled: "bg-gray-100 text-gray-500", no_show: "bg-rose-50 text-rose-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[20px] font-bold text-gray-900">Appointment Scheduling</h1><p className="text-[13px] text-gray-400">Schedule, track, and send automated reminders</p></div>
        <div className="flex gap-2">
          <button onClick={sendReminders} disabled={sending} className="px-3 py-1.5 text-[11px] rounded-md bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 disabled:opacity-40 flex items-center gap-1"><Bell className="w-3 h-3" /> {sending ? "Sending..." : "Send Reminders"}</button>
          <button onClick={seed} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">{seeding ? "Loading..." : "Load Demo"}</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-[20px] font-bold text-gray-900">{stats.total}</p><p className="text-[10px] text-gray-400">Total</p></div>
        <div className="bg-white rounded-xl border border-indigo-200 p-4 text-center"><p className="text-[20px] font-bold text-indigo-600">{stats.todayCount}</p><p className="text-[10px] text-gray-400">Today</p></div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 text-center"><p className="text-[20px] font-bold text-blue-600">{stats.upcoming}</p><p className="text-[10px] text-gray-400">Upcoming</p></div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 text-center"><p className="text-[20px] font-bold text-rose-600">{stats.noShows}</p><p className="text-[10px] text-gray-400">No-Shows</p></div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div> :
      appts.length === 0 ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No appointments</p></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50">
              <th className="text-left px-5 py-2.5">Date</th><th className="text-left px-5 py-2.5">Time</th><th className="text-left px-5 py-2.5">Patient</th><th className="text-left px-5 py-2.5">Provider</th><th className="text-left px-5 py-2.5">Type</th><th className="text-left px-5 py-2.5">Reminder</th><th className="text-left px-5 py-2.5">Status</th>
            </tr></thead>
            <tbody>{appts.map((a, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-700 font-medium">{a.date}</td>
                <td className="px-5 py-3 text-gray-500">{a.time}</td>
                <td className="px-5 py-3 text-gray-700">{a.patientName}<br/><span className="text-[10px] text-gray-400">{a.patientId}</span></td>
                <td className="px-5 py-3 text-gray-500">{a.provider}</td>
                <td className="px-5 py-3 text-gray-500">{a.appointmentType}</td>
                <td className="px-5 py-3">{a.reminderSent ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-gray-300" />}</td>
                <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[a.status] || STATUS_STYLES.scheduled}`}>{a.status.replace("_", " ")}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
