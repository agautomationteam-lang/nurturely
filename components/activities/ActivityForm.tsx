"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Home, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ActivityCard } from "@/components/activities/ActivityCard";
import type { ActivityResult } from "@/types";

export function ActivityForm() {
  const [age, setAge] = useState(4);
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("indoor");
  const [activities, setActivities] = useState<ActivityResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const response = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childAge: age, duration, location })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not find activities");
      setActivities(data.activities);
      toast.success("Activities ready");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not find activities");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Plan the next pocket of time</h2>
          <p className="mt-1 text-sm text-text-secondary">No craft-store shopping list. Just real-life play that fits the day you have.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Label>Child&apos;s age: {age}</Label>
            <Slider className="mt-4" value={[age]} min={1} max={12} step={1} onValueChange={([value]) => setAge(value)} />
          </div>
          <div>
            <Label>Time available</Label>
            <div className="mt-3 flex gap-2">
              {[15, 30, 60].map((value) => (
                <Button key={value} type="button" variant={duration === value ? "default" : "outline"} onClick={() => setDuration(value)}>
                  <Clock className="h-4 w-4" /> {value} min
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <div className="mt-3 flex gap-2">
              {["indoor", "outdoor", "either"].map((value) => (
                <Button key={value} type="button" variant={location === value ? "default" : "outline"} onClick={() => setLocation(value)}>
                  {value === "outdoor" ? <Trees className="h-4 w-4" /> : <Home className="h-4 w-4" />} {value}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Button className="mt-6" size="lg" onClick={submit} disabled={loading}>
          {loading ? "Finding..." : "Find Activities"}
        </Button>
      </Card>
      {activities.length ? (
        <>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Try one, save the rest for later</h2>
          <p className="mt-1 text-sm text-text-secondary">Each idea includes the point of the play, not just the steps.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.title} activity={activity} />
          ))}
        </div>
        </>
      ) : null}
    </div>
  );
}
