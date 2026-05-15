"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ActivityResult } from "@/types";

const icons = ["🧩", "🎨", "🌿"];

export function ActivityCard({ activity, index = 0 }: { activity: ActivityResult; index?: number }) {
  const [done, setDone] = useState(false);
  return (
    <Card className={done ? "border-success bg-[#f7fff9]" : ""}>
      <div className="mb-3 text-3xl">{icons[index % icons.length]}</div>
      <h3 className="text-xl font-semibold text-text-primary">{activity.title}</h3>
      <div>
        <p className="text-sm font-semibold text-primary">Materials</p>
        <p className="mt-1 text-sm text-text-secondary">{activity.materials.join(", ")}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">Steps</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-text-primary">
          {activity.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-primary">Learning benefit:</span> {activity.learningBenefit}
      </p>
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-primary">Safety:</span> {activity.safety}
      </p>
      <Button variant={done ? "outline" : "accent"} onClick={() => setDone(true)} disabled={done}>
        <CheckCircle2 className="h-4 w-4" /> {done ? "Marked as tried" : "Try this"}
      </Button>
    </Card>
  );
}
