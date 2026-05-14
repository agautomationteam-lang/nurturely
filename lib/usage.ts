import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { localDateKey } from "@/lib/utils";

export type UsageKind = "chat" | "story" | "activity";

export function totalUsage(usage?: { chatCount: number; storyCount: number; activityCount: number } | null) {
  if (!usage) return 0;
  return usage.chatCount + usage.storyCount + usage.activityCount;
}

export async function getUsageForToday(userId: string, timeZone = "UTC") {
  const date = localDateKey(timeZone);
  const existing = await prisma.usage.findUnique({ where: { userId } });
  if (existing?.date === date) return existing;
  return prisma.usage.upsert({
    where: { userId },
    create: { userId, date },
    update: { date, chatCount: 0, storyCount: 0, activityCount: 0 }
  });
}

export async function assertCanUseAI(userId: string, status?: string | null, timeZone = "UTC") {
  const usage = await getUsageForToday(userId, timeZone);
  if ((status || "FREE") === "FREE" && totalUsage(usage) >= FREE_DAILY_LIMIT) {
    const error = new Error("Upgrade to Peace Mode");
    error.name = "UsageLimitError";
    throw error;
  }
  return usage;
}

export async function incrementUsage(userId: string, kind: UsageKind) {
  const field = kind === "chat" ? "chatCount" : kind === "story" ? "storyCount" : "activityCount";
  return prisma.usage.update({
    where: { userId },
    data: { [field]: { increment: 1 } }
  });
}
