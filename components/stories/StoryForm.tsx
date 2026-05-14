"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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

export function StoryForm() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { childName: "", childAge: 4, theme: "animals" } });

  async function onSubmit(values: FormValues) {
    setLoading(true);
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
      toast.error(error instanceof Error ? error.message : "Could not generate story");
    } finally {
      setLoading(false);
    }
  }

  if (story) return <StoryDisplay story={story} onNew={() => setStory("")} />;

  return (
    <Card>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="childName">Child&apos;s name</Label>
          <Input id="childName" className="mt-2" {...form.register("childName")} />
          {form.formState.errors.childName ? <p className="mt-1 text-sm text-danger">{form.formState.errors.childName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="childAge">Age</Label>
          <Input id="childAge" className="mt-2" type="number" min={1} max={12} {...form.register("childAge")} />
        </div>
        <div>
          <Label>Theme</Label>
          <Select defaultValue="animals" onValueChange={(value) => form.setValue("theme", value as FormValues["theme"])}>
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
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Generating..." : "Generate Story"}
        </Button>
      </form>
    </Card>
  );
}
