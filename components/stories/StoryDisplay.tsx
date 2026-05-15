"use client";

import DOMPurify from "isomorphic-dompurify";
import { motion } from "framer-motion";
import { Moon, Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function StoryDisplay({ story, onNew }: { story: string; onNew: () => void }) {
  const safeStory = DOMPurify.sanitize(story, { ALLOWED_TAGS: [] });

  function readAloud() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(safeStory);
    utterance.rate = 0.86;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="bg-[#fffdf8] shadow-[0_30px_80px_rgba(27,67,50,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
            <Moon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-semibold text-text-primary">Tonight&apos;s story</h2>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={readAloud}>
            <Volume2 className="h-4 w-4" /> Read Aloud
          </Button>
          <Button variant="ghost" size="sm" onClick={onNew}>
            <RotateCcw className="h-4 w-4" /> Generate Another Story
          </Button>
        </div>
      </div>
      <p className="mb-5 rounded-button bg-primary-light px-4 py-3 text-sm text-primary">Saved automatically to your recent history.</p>
      <article className="whitespace-pre-wrap font-story text-xl leading-9 text-text-primary">{safeStory}</article>
    </Card>
    </motion.div>
  );
}
