"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";

export function useChat() {
  const { messages, addMessage, updateMessage } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  async function send(content: string, category?: string) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;
    const userMessage = { id: crypto.randomUUID(), role: "user" as const, content: trimmed };
    const assistantId = crypto.randomUUID();
    addMessage(userMessage);
    addMessage({ id: assistantId, role: "assistant", content: "" });
    setStreamingMessageId(assistantId);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, category })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Nurturely needs a moment." }));
        throw new Error(data.error || "Nurturely needs a moment.");
      }
      if (!response.body) throw new Error("Streaming response was empty");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        updateMessage(assistantId, answer);
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        answer += finalChunk;
        updateMessage(assistantId, answer);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      updateMessage(assistantId, "I could not answer that just now. Please try again in a moment.");
    } finally {
      setStreamingMessageId(null);
      setLoading(false);
    }
  }

  return { messages, loading, streamingMessageId, send };
}
