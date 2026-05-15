"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StoryDisplay } from "@/components/stories/StoryDisplay";
import { storyThemes } from "@/lib/constants";

const schema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  childAge: z.coerce.number().min(1).max(12),
  theme: z.enum(storyThemes)
});

type FormValues = z.infer<typeof schema>;
type RecentStory = { id: string; childName: string; theme: string; content: string; createdAt: string };

export function StoryForm({ recentStories = [] }: { recentStories?: RecentStory[] }) {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { childName: "", childAge: 4, theme: "Animals" } });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate story");
      setStory(data.story);
      toast.success("Story ready");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Try again →";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (story) return <StoryDisplay story={story} onNew={() => setStory("")} />;

  return (
    <div className="space-y-5">
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
    <Card>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-primary-light text-primary">
          <WandSparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Build tonight&apos;s story</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">Use a real interest your child already loves. Familiar details help the story feel safe.</p>
        </div>
      </div>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="childName">Child&apos;s name</Label>
          <Input id="childName" className="mt-2" placeholder="Maya" {...form.register("childName")} />
          {form.formState.errors.childName ? <p className="mt-1 text-sm text-danger">{form.formState.errors.childName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="childAge">Age</Label>
          <Input id="childAge" className="mt-2" type="number" min={1} max={12} {...form.register("childAge")} />
        </div>
        </div>
        <div>
          <Label>Theme</Label>
          <Select defaultValue="Animals" onValueChange={(value) => form.setValue("theme", value as FormValues["theme"])}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {storyThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error ? <p className="rounded-button bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">{error}</p> : null}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Weaving your story..." : "Generate Story"}
        </Button>
      </form>
    </Card>
    </motion.div>
    {recentStories.length ? (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-text-primary">Last 3 stories</h2>
        {recentStories.map((item) => (
          <details key={item.id} className="rounded-card border border-primary/10 bg-white p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-text-primary">{item.childName} and {item.theme}</summary>
            <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-text-secondary">{item.content}</p>
          </details>
        ))}
      </section>
    ) : null}
    </div>
  );
}
