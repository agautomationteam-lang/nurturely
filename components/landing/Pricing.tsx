import { Check, Star } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  { name: "Free", price: "$0", description: "3 AI interactions per day", items: ["Ask parenting questions", "Stories and activities", "Daily Peace setup"], featured: false },
  { name: "Peace Mode", price: "$19/mo", description: "Unlimited calm moments", items: ["Unlimited AI support", "Unlimited stories", "Unlimited activities", "Daily Peace texts"], featured: true },
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
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.featured ? "border-primary bg-primary text-white" : ""}>
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
            <SignUpButton mode="modal">
              <Button className="mt-7 w-full" variant={plan.featured ? "accent" : "outline"}>
                Start Your First Calm Moment
              </Button>
            </SignUpButton>
          </Card>
        ))}
      </div>
    </section>
  );
}
