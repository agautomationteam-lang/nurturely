"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const quotes = [
  ["I used to spiral after bedtime battles. Nurturely helps me take one calm next step.", "Maya, parent of two"],
  ["The stories are sweet, short, and somehow exactly what my son wants to hear.", "Jordan, dad of a 5-year-old"],
  ["It feels like texting the friend who always knows how to lower the temperature.", "Priya, mom of a toddler"]
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((value) => (value + 1) % quotes.length), 4000);
    return () => window.clearInterval(id);
  }, []);
  const [quote, name] = quotes[index];

  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Card className="text-center">
              <p className="text-xl leading-9 text-text-primary">&ldquo;{quote}&rdquo;</p>
              <p className="mt-5 text-sm font-semibold text-primary">{name}</p>
            </Card>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex justify-center gap-2">
          {quotes.map((item, dotIndex) => (
            <button
              key={item[1]}
              className={`h-2.5 rounded-full transition-all ${dotIndex === index ? "w-8 bg-primary" : "w-2.5 bg-primary-light"}`}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show testimonial ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
