"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { motion } from "framer-motion";
import { Moon, Pause, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ReadState = "idle" | "playing" | "paused";

function chooseTenderVoice() {
  const voices = window.speechSynthesis.getVoices();
  const preferredNames = ["Samantha", "Ava", "Jenny", "Aria", "Zira", "Karen", "Moira", "Tessa", "Serena", "Female"];
  return (
    voices.find((voice) => preferredNames.some((name) => voice.name.toLowerCase().includes(name.toLowerCase())) && voice.lang.startsWith("en")) ||
    voices.find((voice) => voice.lang.startsWith("en")) ||
    null
  );
}

export function StoryDisplay({ story, onNew }: { story: string; onNew: () => void }) {
  const safeStory = DOMPurify.sanitize(story, { ALLOWED_TAGS: [] });
  const [readState, setReadState] = useState<ReadState>("idle");
  const [voiceName, setVoiceName] = useState("your browser's softest available voice");
  const audioContextRef = useRef<AudioContext | null>(null);
  const lullabyTimersRef = useRef<number[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    function loadVoiceName() {
      const voice = chooseTenderVoice();
      if (voice) setVoiceName(voice.name);
    }

    loadVoiceName();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoiceName);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoiceName);
      stopReadAloud();
    };
    // stopReadAloud intentionally remains stable enough for cleanup because it only reads refs/window state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopLullaby() {
    lullabyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    lullabyTimersRef.current = [];
    gainRef.current?.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.25);
    window.setTimeout(() => {
      audioContextRef.current?.close().catch(() => undefined);
      audioContextRef.current = null;
      gainRef.current = null;
    }, 450);
  }

  function startLullaby() {
    stopLullaby();
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.035;
    gain.connect(context.destination);
    audioContextRef.current = context;
    gainRef.current = gain;

    const notes = [392, 440, 392, 329.63, 349.23, 392, 329.63, 293.66];
    const playNote = (frequency: number, delay: number) => {
      const timer = window.setTimeout(() => {
        if (!audioContextRef.current || !gainRef.current) return;
        const oscillator = context.createOscillator();
        const noteGain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        noteGain.gain.setValueAtTime(0, context.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.09, context.currentTime + 0.18);
        noteGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.8);
        oscillator.connect(noteGain).connect(gain);
        oscillator.start();
        oscillator.stop(context.currentTime + 1.9);
      }, delay);
      lullabyTimersRef.current.push(timer);
    };

    for (let loop = 0; loop < 60; loop += 1) {
      notes.forEach((frequency, index) => playNote(frequency, loop * 9600 + index * 1200));
    }
  }

  function readAloud() {
    window.speechSynthesis.cancel();
    startLullaby();
    const utterance = new SpeechSynthesisUtterance(safeStory);
    const voice = chooseTenderVoice();
    if (voice) {
      utterance.voice = voice;
      setVoiceName(voice.name);
    }
    utterance.rate = 0.78;
    utterance.pitch = 1.08;
    utterance.volume = 0.92;
    utterance.onend = () => {
      setReadState("idle");
      stopLullaby();
    };
    utterance.onerror = () => {
      setReadState("idle");
      stopLullaby();
    };
    setReadState("playing");
    window.speechSynthesis.speak(utterance);
  }

  function pauseReadAloud() {
    window.speechSynthesis.pause();
    gainRef.current?.gain.setTargetAtTime(0.012, audioContextRef.current?.currentTime || 0, 0.2);
    setReadState("paused");
  }

  function resumeReadAloud() {
    window.speechSynthesis.resume();
    gainRef.current?.gain.setTargetAtTime(0.035, audioContextRef.current?.currentTime || 0, 0.2);
    setReadState("playing");
  }

  function stopReadAloud() {
    window.speechSynthesis.cancel();
    stopLullaby();
    setReadState("idle");
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
          {readState === "idle" ? (
            <Button variant="outline" size="sm" onClick={readAloud}>
              <Volume2 className="h-4 w-4" /> Read Tenderly
            </Button>
          ) : null}
          {readState === "playing" ? (
            <Button variant="outline" size="sm" onClick={pauseReadAloud}>
              <Pause className="h-4 w-4" /> Pause
            </Button>
          ) : null}
          {readState === "paused" ? (
            <Button variant="outline" size="sm" onClick={resumeReadAloud}>
              <Play className="h-4 w-4" /> Resume
            </Button>
          ) : null}
          {readState !== "idle" ? (
            <Button variant="ghost" size="sm" onClick={stopReadAloud}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={onNew}>
            <RotateCcw className="h-4 w-4" /> Generate Another Story
          </Button>
        </div>
      </div>
      <p className="mb-5 rounded-button bg-primary-light px-4 py-3 text-sm text-primary">
        Saved automatically to your recent history. Bedtime audio uses {voiceName} with a soft generated lullaby underneath.
      </p>
      <article className="whitespace-pre-wrap font-story text-xl leading-9 text-text-primary">{safeStory}</article>
    </Card>
    </motion.div>
  );
}
