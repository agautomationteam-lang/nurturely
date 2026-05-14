import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function saveDailyPeace(formData: FormData) {
  "use server";
  const user = await requireAppUser();
  const email = String(formData.get("email") || "");
  const time = String(formData.get("time") || "08:00");
  const isActive = formData.get("isActive") === "on";

  await prisma.dailyPeace.upsert({
    where: { userId: user.clerkUserId },
    create: { userId: user.clerkUserId, email, time, isActive },
    update: { email, time, isActive }
  });
  await prisma.user.update({
    where: { clerkUserId: user.clerkUserId },
    data: { dailyPeaceEmail: email, dailyPeaceEnabled: isActive }
  });
  revalidatePath("/dashboard/peace");
  redirect("/dashboard/peace?saved=1");
}

export default async function DailyPeacePage() {
  const user = await requireAppUser();
  const settings = user.dailyPeace;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Daily Peace</h1>
        <p className="mt-2 text-text-secondary">One reassuring message every morning. Like a friend who gets it.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <form action={saveDailyPeace} className="space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
                <Input id="email" name="email" required type="email" defaultValue={settings?.email || user.dailyPeaceEmail || user.email} placeholder="parent@example.com" className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="time">Delivery time</Label>
              <Input id="time" name="time" type="time" defaultValue={settings?.time || "08:00"} className="mt-2" />
            </div>
            <div className="flex items-center justify-between rounded-button bg-background p-4">
              <div>
                <p className="font-medium text-text-primary">Daily texts</p>
                <p className="text-sm text-text-secondary">Turn your morning encouragement on or off.</p>
              </div>
              <Switch name="isActive" defaultChecked={settings?.isActive ?? true} />
            </div>
            <Button type="submit" size="lg">Save Daily Peace</Button>
          </form>
        </Card>
        <Card className="bg-primary text-white">
          <MessageSquare className="h-8 w-8 text-primary-light" />
          <h2 className="mt-5 text-xl font-semibold text-white">Preview</h2>
          <div className="mt-5 rounded-card bg-white p-4 text-text-primary">
            Morning. Before the day starts asking everything from you, take one breath. You do not have to solve the whole day at breakfast.
          </div>
          <p className="mt-4 text-sm text-white/75">Free users can receive 2 Daily Peace emails, then Peace Mode unlocks ongoing delivery.</p>
        </Card>
      </div>
    </div>
  );
}
