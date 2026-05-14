"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MessageBubble({ role, content, streaming = false }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[82%] rounded-card px-4 py-3 leading-7 shadow-sm", isUser ? "bg-[#F3E3CF] text-text-primary" : "bg-white text-text-primary")}>
        {content}
        {streaming ? <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-primary align-middle" /> : null}
      </div>
    </motion.div>
  );
}
