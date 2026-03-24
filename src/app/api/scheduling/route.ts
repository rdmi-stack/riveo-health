/* Appointment Scheduling + Reminders — POST: book/remind, GET: list */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COL = "appointments";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orgId = "demo" } = body;

    if (action === "book") {
      const { patientId, patientName, provider, appointmentType, date, time, duration = 30, notes } = body;
      const c = await col();
      const result = await c.insertOne({
        orgId, patientId, patientName, provider, appointmentType: appointmentType || "Office Visit",
        date, time, duration, notes: notes || "",
        status: "scheduled", reminderSent: false,
        confirmationCode: `APT-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date(),
      });
      return NextResponse.json({ success: true, id: result.insertedId.toString(), confirmationCode: `APT-${Date.now().toString(36).toUpperCase()}` });
    }

    if (action === "send_reminders") {
      const c = await col();
      const upcoming = await c.find({ orgId, status: "scheduled", reminderSent: false }).toArray();
      if (upcoming.length > 0) {
        await c.updateMany({ orgId, status: "scheduled", reminderSent: false }, { $set: { reminderSent: true, reminderSentAt: new Date() } });
      }
      return NextResponse.json({ success: true, remindersSent: upcoming.length });
    }

    if (action === "seed_demo") {
      const providers = ["Dr. Sarah Chen", "Dr. James Wilson", "Dr. Maria Garcia"];
      const types = ["Office Visit", "Follow-up", "Annual Physical", "Lab Work", "Specialist Consult"];
      const c = await col();
      const demos = Array.from({ length: 12 }, (_, i) => {
        const daysFromNow = i - 3; // some past, some future
        const date = new Date(Date.now() + daysFromNow * 86400000);
        return {
          orgId, patientId: `PAT-${String(Math.floor(Math.random() * 100)).padStart(4, "0")}`,
          patientName: ["Sarah Johnson", "Michael Brown", "Emily Davis", "James Wilson", "Lisa Martinez", "Robert Taylor"][i % 6],
          provider: providers[i % 3], appointmentType: types[i % 5],
          date: date.toISOString().split("T")[0], time: `${9 + (i % 8)}:${i % 2 === 0 ? "00" : "30"}`,
          duration: [15, 30, 30, 45][i % 4], notes: "", status: daysFromNow < 0 ? "completed" : daysFromNow === 0 ? "checked_in" : "scheduled",
          reminderSent: daysFromNow <= 1, noShow: daysFromNow < 0 && Math.random() < 0.1,
          confirmationCode: `APT-${Date.now().toString(36).toUpperCase()}${i}`, createdAt: new Date(),
        };
      });
      await c.deleteMany({ orgId });
      await c.insertMany(demos);
      return NextResponse.json({ success: true, count: demos.length });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ date: 1, time: 1 }).limit(30).toArray();
    const today = new Date().toISOString().split("T")[0];
    return NextResponse.json({
      appointments: items, total: items.length,
      todayCount: items.filter((a: any) => a.date === today).length,
      upcoming: items.filter((a: any) => a.date >= today && a.status === "scheduled").length,
      noShows: items.filter((a: any) => a.noShow).length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
