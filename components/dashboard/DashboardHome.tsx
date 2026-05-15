"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, MessageCircle, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

const cards = [
  { href: "/dashboard/ask", title: "Ask a Worry", icon: MessageCircle, text: "Get one calm next step for the thing on your mind." },
  { href: "/dashboard/stories", title: "Bedtime Story", icon: Moon, text: "Create a sleepy story that makes bedtime softer." },
  { href: "/dashboard/activities", title: "Activity Ideas", icon: Sparkles, text: "Find easy play for the age, place, and time you have." },
  { href: "/dashboard/peace", title: "Daily Peace", icon: Heart, text: "Set a morning email that helps you breathe first." }
];

export function DashboardHome({ firstName, used, plan, upgraded }: { firstName: string; used: number; plan: string; upgraded: boolean }) {
  const hour = new Date().getHours();
  const dayPart = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const pct = plan === "ACTIVE" ? 100 : Math.min(100, (used / FREE_DAILY_LIMIT) * 100);

  return (
    <div className="space-y-6">
      {upgraded ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[28px] bg-[#fff4e8] p-5 text-text-primary shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.28),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(244,162,97,0.32),transparent_22%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase text-primary">Welcome to Peace Mode</p>
            <h2 className="mt-1 text-2xl font-semibold">Unlimited calm is unlocked.</h2>
          </div>
        </motion.div>
      ) : null}
      <section className="rounded-[32px] bg-primary p-6 text-white shadow-soft md:p-8">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold uppercase tracking-wide text-primary-light">
          Good {dayPart}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
          Good {dayPart}, {firstName}. You&apos;re doing great.
        </motion.h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">Pick the kind of support you need. Nurturely will keep it warm, practical, and clear.</p>
      </section>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Today&apos;s AI interactions</h2>
            <p className="mt-1 text-sm text-text-secondary">{plan === "ACTIVE" ? "Peace Mode is active." : `${used} of ${FREE_DAILY_LIMIT} free interactions used today.`}</p>
          </div>
          <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary">{plan === "ACTIVE" ? "Unlimited" : `${Math.max(0, FREE_DAILY_LIMIT - used)} left`}</span>
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6 }} className="mt-4 origin-left">
          <Progress value={pct} />
        </motion.div>
      </Card>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div key={card.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
            <Link href={card.href}>
              <Card className="group h-full transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(45,106,79,0.18)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-light">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-text-primary">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{card.text}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
