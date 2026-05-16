"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "@/components/shared/CheckoutButton";

const plans = [
  { name: "Free", price: "$0", description: "20 AI interactions per day", items: ["Ask parenting questions", "Stories and activities", "Daily Peace setup"], featured: false },
  { name: "Peace Mode", price: "$19/mo", description: "Unlimited calm moments", items: ["Unlimited AI support", "Unlimited stories", "Unlimited activities", "Daily Peace emails"], featured: true },
  { name: "Family Mode", price: "$29/mo", description: "For shared caregiving", items: ["Everything in Peace Mode", "More caregiver seats", "Family-oriented guidance"], featured: false }
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-semibold text-text-primary">Simple pricing for calmer days.</h2>
        <p className="mt-3 text-text-secondary">Start free, upgrade when Nurturely becomes part of your parenting rhythm.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
          <Card className={plan.featured ? "relative scale-[1.03] border-2 border-primary bg-primary text-white" : "h-full"}>
            {plan.featured ? <span className="absolute right-5 top-5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">Most Popular</span> : null}
            <div className="flex items-center justify-between">
              <h3 className={plan.featured ? "text-xl font-semibold text-white" : "text-xl font-semibold text-text-primary"}>{plan.name}</h3>
              {plan.featured ? <Check className="h-6 w-6 text-primary-light" /> : plan.name === "Family Mode" ? <Star className="h-6 w-6 text-accent" /> : null}
            </div>
            <p className={plan.featured ? "mt-4 text-4xl font-semibold text-white" : "mt-4 text-4xl font-semibold text-text-primary"}>{plan.price}</p>
            <p className={plan.featured ? "mt-2 text-white/80" : "mt-2 text-text-secondary"}>{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className={plan.featured ? "h-4 w-4 text-primary-light" : "h-4 w-4 text-success"} />
                  <span className={plan.featured ? "text-white/90" : "text-text-primary"}>{item}</span>
                </li>
              ))}
            </ul>
            {plan.name === "Free" ? (
              <div className="mt-7">
                <Button asChild className="w-full transition hover:scale-[1.02]" variant="outline">
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
                <p className="mt-2 text-center text-xs text-text-secondary">No credit card required</p>
              </div>
            ) : plan.name === "Peace Mode" ? (
              <div className="mt-7">
                <CheckoutButton className="w-full transition hover:scale-[1.02]" variant="accent" priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID} plan="peace">Start Peace Mode</CheckoutButton>
                <p className="mt-2 text-center text-xs text-white/75">Cancel anytime.</p>
              </div>
            ) : (
              <div className="mt-7">
                <CheckoutButton className="w-full transition hover:scale-[1.02]" variant="outline" priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FAMILY} plan="family">Start Family Mode</CheckoutButton>
                <p className="mt-2 text-center text-xs text-text-secondary">Cancel anytime.</p>
              </div>
            )}
          </Card>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-text-secondary">Already a parent inside Nurturely? <Link href="/dashboard/settings" className="font-semibold text-primary">Manage billing from Settings.</Link></p>
    </section>
  );
}
