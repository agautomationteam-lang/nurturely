"use client";

import { Heart, MessageCircle, Moon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const features = [
  { icon: MessageCircle, title: "Ask Anything", text: "Get calm, evidence-informed guidance for sleep, food, behavior, school, and emotions." },
  { icon: Moon, title: "Bedtime Stories", text: "Generate gentle 2-3 minute stories starring your child and their favorite theme." },
  { icon: Sparkles, title: "Activity Ideas", text: "Find screen-free activities that fit your child's age, your space, and the time you have." },
  { icon: Heart, title: "Daily Peace Emails", text: "Receive one warm daily email that helps you start the day with steadier shoulders." }
];

export function Features() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div key={feature.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.08 }}>
          <Card className="h-full transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(45,106,79,0.18)]">
            <motion.div animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}>
              <feature.icon className="h-7 w-7 text-primary" />
            </motion.div>
            <h2 className="mt-5 text-xl font-semibold text-text-primary">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{feature.text}</p>
          </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
