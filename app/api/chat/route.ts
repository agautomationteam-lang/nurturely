import { NextResponse } from "next/server";
import { z } from "zod";
import { CHAT_SYSTEM_PROMPT } from "@/lib/constants";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTextStream } from "@/lib/openai";
import { assertCanUseAI, incrementUsage } from "@/lib/usage";

const schema = z.object({
  message: z.string().min(1).max(2000),
  category: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await requireAppUser();
    await assertCanUseAI(user.clerkUserId, user.subscription?.status, user.timezone);
    const prompt = input.category ? `Category: ${input.category}\nParent worry: ${input.message}` : input.message;
    const openAIStream = await createTextStream(CHAT_SYSTEM_PROMPT, prompt);
    const encoder = new TextEncoder();
    let answer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of openAIStream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (!token) continue;
            answer += token;
            controller.enqueue(encoder.encode(token));
          }

          await prisma.chat.create({
            data: { userId: user.clerkUserId, question: input.message, answer, category: input.category }
          });
          await incrementUsage(user.clerkUserId, "chat");
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nurturely could not answer right now";
    const status = error instanceof Error && error.name === "UsageLimitError" ? 403 : message.includes("OPENAI_API_KEY") ? 503 : 400;
    return NextResponse.json({ error: status === 503 ? "AI service is not configured. Check OPENAI_API_KEY." : message }, { status });
  }
}
