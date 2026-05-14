import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { localDateKey } from "@/lib/utils";

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

  return prisma.user.upsert({
    where: { clerkUserId: clerkUser.id },
    create: {
      clerkUserId: clerkUser.id,
      email,
      name,
      subscription: { create: { status: "FREE" } },
      usage: { create: { date: localDateKey("UTC") } }
    },
    update: { email, name, deletedAt: null },
    include: { subscription: true, usage: true, dailyPeace: true }
  });
}
