"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { categories } from "@/lib/constants";
import { useChat } from "@/hooks/useChat";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const { messages, loading, streamingMessageId, send } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const content = category ? `[${category}] ${input}` : input;
    setInput("");
    await send(content, category);
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-card border border-primary/10 bg-background shadow-soft">
      <div className="border-b border-primary/10 bg-white p-5">
        <h1 className="text-2xl font-semibold text-text-primary">Is This Normal?</h1>
        <p className="mt-1 text-sm text-text-secondary">Ask anything. Nurturely will validate, steady, and offer one practical next step.</p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="mx-auto mt-20 max-w-lg text-center text-text-secondary">What worry is sitting loudest in your mind right now?</div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} role={message.role} content={message.content} streaming={message.id === streamingMessageId} />)
        )}
        {loading && !streamingMessageId ? (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-card bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={onSubmit} className="border-t border-primary/10 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setCategory(category === chip ? undefined : chip)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${category === chip ? "bg-primary text-white" : "bg-primary-light text-primary"}`}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask Nurturely..."
            className="min-h-12 resize-none"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
