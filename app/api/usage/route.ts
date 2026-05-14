import { NextResponse } from "next/server";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { requireAppUser } from "@/lib/auth";
import { getUsageForToday, totalUsage } from "@/lib/usage";

export async function GET() {
  try {
    const user = await requireAppUser();
    const usage = await getUsageForToday(user.clerkUserId, user.timezone);
    return NextResponse.json({ used: totalUsage(usage), limit: FREE_DAILY_LIMIT, status: user.subscription?.status || "FREE" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
