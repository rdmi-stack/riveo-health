/* ───────────────────────────────────────────────────────
   GET /api/analytics — Dashboard analytics & stats
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const claimsCol = await getCollection(Collections.CLAIMS);
    const denialsCol = await getCollection(Collections.DENIALS);

    // Run all aggregations in parallel
    const [
      totalClaims,
      statusBreakdown,
      totalBilled,
      totalPaid,
      denialsByReason,
      denialsByPayer,
      denialStats,
      recentDenials,
      monthlyTrend,
    ] = await Promise.all([
      // Total claims
      claimsCol.countDocuments({ orgId }),

      // Status breakdown
      claimsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: "$status", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } },
      ]).toArray(),

      // Total billed
      claimsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: null, total: { $sum: "$billedAmount" } } },
      ]).toArray(),

      // Total paid
      claimsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: null, total: { $sum: "$paidAmount" } } },
      ]).toArray(),

      // Denials by reason code
      denialsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: "$denialCode", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),

      // Denials by payer
      denialsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: "$payer", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      // Denial status counts
      denialsCol.aggregate([
        { $match: { orgId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).toArray(),

      // Recent denials (last 5)
      denialsCol.find({ orgId }).sort({ createdAt: -1 }).limit(5).toArray(),

      // Monthly claims trend (last 3 months)
      claimsCol.aggregate([
        { $match: { orgId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$dateOfService" } },
            claims: { $sum: 1 },
            billed: { $sum: "$billedAmount" },
            paid: { $sum: "$paidAmount" },
            denied: { $sum: { $cond: [{ $eq: ["$status", "denied"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 6 },
      ]).toArray(),
    ]);

    const totalBilledAmt = totalBilled[0]?.total || 0;
    const totalPaidAmt = totalPaid[0]?.total || 0;
    const deniedCount = statusBreakdown.find((s: any) => s._id === "denied")?.count || 0;
    const denialRate = totalClaims > 0 ? deniedCount / totalClaims : 0;

    return NextResponse.json({
      summary: {
        totalClaims,
        totalBilled: totalBilledAmt,
        totalPaid: totalPaidAmt,
        totalDenied: deniedCount,
        denialRate,
        collectionRate: totalBilledAmt > 0 ? totalPaidAmt / totalBilledAmt : 0,
        outstandingAR: totalBilledAmt - totalPaidAmt,
      },
      statusBreakdown,
      denialsByReason,
      denialsByPayer,
      denialStats,
      recentDenials,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
