"use client";

import DOMPurify from "isomorphic-dompurify";
import { Moon, Save, Volume2, RotateCcw } from "lucide-react";
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
    <Card className="bg-[#fffdf8]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
            <Moon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-semibold text-text-primary">Tonight&apos;s story</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={readAloud}>
            <Volume2 className="h-4 w-4" /> Read Aloud
          </Button>
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onNew}>
            <RotateCcw className="h-4 w-4" /> New Story
          </Button>
        </div>
      </div>
      <article className="whitespace-pre-wrap font-story text-xl leading-9 text-text-primary">{safeStory}</article>
    </Card>
  );
}
