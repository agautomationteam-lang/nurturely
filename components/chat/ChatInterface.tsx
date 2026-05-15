"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Check, HeartPulse, Send, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const content = input;
    setInput("");
    await send(content, category);
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-[680px] flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-[#fffdf8] shadow-soft lg:h-[calc(100vh-3rem)]">
      <div className="border-b border-primary/10 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Calm Coach</p>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">What worry needs a calmer next step?</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Share the messy version. Nurturely will validate what you are feeling, separate normal parenting stress from red flags, and give you one doable action.
            </p>
          </div>
          <div className="rounded-card bg-primary-light px-4 py-3 text-sm text-primary">
            <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Not a diagnosis</div>
            <p className="mt-1 text-primary/80">Medical concerns still belong with your pediatrician.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="mx-auto mt-14 max-w-2xl rounded-[28px] border border-primary/10 bg-white p-6 text-center shadow-sm">
            <HeartPulse className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-text-primary">Start with the thing you keep replaying.</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Try: “My 5-year-old refuses dinner every night,” or “My toddler only sleeps if I sit by the door.”
            </p>
          </div>
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
              aria-pressed={category === chip}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === chip ? "bg-primary text-white shadow-sm" : "bg-primary-light text-primary hover:bg-[#c7ebcf]"}`}
            >
              {category === chip ? <Check className="mr-1 inline h-3.5 w-3.5" /> : null}{chip}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {messages.length > 1 && !loading ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3 flex flex-wrap gap-2">
              {["What should I try first?", "What is normal here?", "When should I ask for help?"].map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary">
                  {suggestion}
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
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
