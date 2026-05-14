import OpenAI from "openai";
import { assertEnv } from "@/lib/utils";

let client: OpenAI | null = null;

export function getOpenAI() {
  if (!client) {
    client = new OpenAI({ apiKey: assertEnv("OPENAI_API_KEY") });
  }
  return client;
}

export async function generateText(system: string, prompt: string) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0]?.message?.content?.trim() || "I am here with you. Try again in a moment.";
}

export async function createTextStream(system: string, prompt: string) {
  return getOpenAI().chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    stream: true,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });
}
