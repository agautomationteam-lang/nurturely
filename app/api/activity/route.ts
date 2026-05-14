import { NextResponse } from "next/server";
import { z } from "zod";
import { ACTIVITY_SYSTEM_PROMPT } from "@/lib/constants";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateText } from "@/lib/openai";
import { assertCanUseAI, incrementUsage } from "@/lib/usage";
import type { ActivityResult } from "@/types";

const schema = z.object({
  childAge: z.coerce.number().int().min(1).max(12),
  duration: z.coerce.number().int().min(15).max(60),
  location: z.enum(["indoor", "outdoor", "either"])
});

function fallbackActivities(raw: string): ActivityResult[] {
  return [
    {
      title: "Nurturely Activity Plan",
      materials: ["Common household items"],
      steps: raw.split("\n").filter(Boolean).slice(0, 5),
      learningBenefit: "Supports connection, language, and flexible thinking.",
      safety: "Stay nearby and adapt any small items for your child's age."
    }
  ];
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await requireAppUser();
    await assertCanUseAI(user.clerkUserId, user.subscription?.status, user.timezone);
    const system = ACTIVITY_SYSTEM_PROMPT.replace("[childAge]", String(input.childAge)).replace("[duration]", String(input.duration)).replace("[location]", input.location);
    const raw = await generateText(system, "Return JSON only: an array of exactly 3 objects with title, materials, steps, learningBenefit, and safety.");
    let activities: ActivityResult[];
    try {
      activities = JSON.parse(raw.replace(/^```json|```$/g, "").trim());
    } catch {
      activities = fallbackActivities(raw);
    }
    await prisma.activity.create({ data: { userId: user.clerkUserId, childAge: input.childAge, duration: input.duration, location: input.location, content: JSON.stringify(activities) } });
    await incrementUsage(user.clerkUserId, "activity");
    return NextResponse.json({ activities });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate activities";
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.name === "UsageLimitError" ? 403 : 400 });
  }
}
