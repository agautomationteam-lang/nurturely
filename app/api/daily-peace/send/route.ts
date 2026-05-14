import { NextResponse } from "next/server";
import { DAILY_PEACE_SYSTEM_PROMPT } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { generateText } from "@/lib/openai";
import { getResend } from "@/lib/resend";

function timeOfDay(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date());
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      dailyPeaceEnabled: true,
      dailyPeaceEmail: { not: null }
    },
    select: {
      clerkUserId: true,
      name: true,
      email: true,
      timezone: true,
      dailyPeaceEmail: true
    }
  });

  const results = await Promise.allSettled(
    users.map(async (user) => {
      const message = await generateText(DAILY_PEACE_SYSTEM_PROMPT.replace("[timeOfDay]", timeOfDay(user.timezone)), "Write today's Daily Peace email.");
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Nurturely <daily@nurturely.app>",
        to: user.dailyPeaceEmail || user.email,
        subject: "Your Daily Peace from Nurturely",
        text: message,
        html: `<p style="font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1B4332">${message}</p>`
      });
      return user.clerkUserId;
    })
  );

  return NextResponse.json({
    sent: results.filter((result) => result.status === "fulfilled").length,
    failed: results.filter((result) => result.status === "rejected").length
  });
}

export const POST = GET;
