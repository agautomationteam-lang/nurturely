import { NextResponse } from "next/server";
import { z } from "zod";
import { STORY_SYSTEM_PROMPT, storyThemes } from "@/lib/constants";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateText } from "@/lib/openai";
import { assertCanUseAI, incrementUsage } from "@/lib/usage";

const schema = z.object({
  childName: z.string().min(1).max(60),
  childAge: z.coerce.number().int().min(1).max(12),
  theme: z.enum(storyThemes)
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await requireAppUser();
    await assertCanUseAI(user.clerkUserId, user.subscription?.status, user.timezone);
    const system = STORY_SYSTEM_PROMPT.replace("[childName]", input.childName).replace("[childAge]", String(input.childAge)).replace("[theme]", input.theme);
    const story = await generateText(system, `Create the bedtime story now for ${input.childName}.`);
    await prisma.story.create({ data: { userId: user.clerkUserId, childName: input.childName, childAge: input.childAge, theme: input.theme, content: story } });
    await incrementUsage(user.clerkUserId, "story");
    return NextResponse.json({ story });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate story";
    const status = error instanceof Error && error.name === "UsageLimitError" ? 403 : message.includes("OPENAI_API_KEY") ? 503 : 400;
    return NextResponse.json({ error: status === 503 ? "Story generation needs OPENAI_API_KEY configured." : message }, { status });
  }
}
