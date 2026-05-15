import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { localDateKey } from "@/lib/utils";

const userInclude = { subscription: true, usage: true, dailyPeace: true } as const;

export async function requireAppUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("A verified email address is required");
  }

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || null;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const user = await prisma.user.upsert({
    where: { clerkUserId: clerkUser.id },
    create: {
      clerkUserId: clerkUser.id,
      email,
      name,
      timezone: timeZone,
      subscription: { create: { status: "FREE" } },
      usage: { create: { date: localDateKey(timeZone) } }
    },
    update: { email, name, deletedAt: null },
    include: userInclude
  });

  if (!user.subscription) {
    await prisma.subscription.upsert({
      where: { userId: user.clerkUserId },
      create: { userId: user.clerkUserId, status: "FREE" },
      update: {}
    });
  }

  if (!user.usage) {
    await prisma.usage.upsert({
      where: { userId: user.clerkUserId },
      create: { userId: user.clerkUserId, date: localDateKey(user.timezone || "UTC") },
      update: {}
    });
  }

  if (user.subscription && user.usage) return user;

  return prisma.user.findUniqueOrThrow({
    where: { clerkUserId: user.clerkUserId },
    include: userInclude
  });
}
