import { Heart, MessageCircle, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { icon: MessageCircle, title: "Ask Anything", text: "Get calm, evidence-informed guidance for sleep, food, behavior, school, and emotions." },
  { icon: Moon, title: "Bedtime Stories", text: "Generate gentle 2-3 minute stories starring your child and their favorite theme." },
  { icon: Sparkles, title: "Activity Ideas", text: "Find screen-free activities that fit your child's age, your space, and the time you have." },
  { icon: Heart, title: "Daily Peace Texts", text: "Receive one warm daily text that helps you start the day with steadier shoulders." }
];

export function Features() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="transition hover:scale-[1.02] hover:shadow-xl">
            <feature.icon className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-semibold text-text-primary">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{feature.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
