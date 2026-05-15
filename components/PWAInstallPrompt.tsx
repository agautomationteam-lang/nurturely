"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("nurturely-pwa-dismissed") === "1";
    const handler = async (installEvent: Event) => {
      installEvent.preventDefault();
      setEvent(installEvent as BeforeInstallPromptEvent);
      if (dismissed) return;
      const usage = await fetch("/api/usage").then((res) => res.ok ? res.json() : null).catch(() => null);
      if ((usage?.used || 0) >= 2) setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice.catch(() => undefined);
    setVisible(false);
    localStorage.setItem("nurturely-pwa-dismissed", "1");
  }

  function dismiss() {
    setVisible(false);
    localStorage.setItem("nurturely-pwa-dismissed", "1");
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-[24px] border border-primary/10 bg-white p-4 shadow-soft lg:bottom-6"
        >
          <button className="absolute right-3 top-3 text-text-secondary" onClick={dismiss} aria-label="Dismiss install prompt">
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-primary-light text-primary">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-text-primary">Add Nurturely to your home screen</h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">Get the full app experience. It opens fast and keeps the calm close.</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={install}>Install</Button>
                <Button size="sm" variant="ghost" onClick={dismiss}>Dismiss</Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
