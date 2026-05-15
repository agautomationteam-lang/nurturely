"use client";

import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MessageBubble({ role, content, streaming = false }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const isUser = role === "user";
  async function copy() {
    await navigator.clipboard.writeText(content);
    toast.success("Copied");
  }
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("group relative max-w-[82%] rounded-card px-4 py-3 leading-7 shadow-sm", isUser ? "bg-[#F3E3CF] text-text-primary" : "bg-white text-text-primary")}>
        {content}
        {streaming ? <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-primary align-middle" /> : null}
        {!isUser && content && !streaming ? (
          <button onClick={copy} className="absolute -right-2 -top-2 rounded-full bg-primary p-2 text-white opacity-0 shadow-sm transition group-hover:opacity-100" aria-label="Copy response">
            <Copy className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
