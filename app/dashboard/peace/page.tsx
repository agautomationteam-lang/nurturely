import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function saveDailyPeace(formData: FormData) {
  "use server";
  const user = await requireAppUser();
  const email = user.email;
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

export default async function DailyPeacePage({ searchParams }: { searchParams?: Promise<{ saved?: string }> }) {
  const user = await requireAppUser();
  const settings = user.dailyPeace;
  const params = searchParams ? await searchParams : {};
  const saved = params.saved === "1";

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-primary p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Morning support</p>
        <h1 className="mt-2 text-3xl font-semibold">Daily Peace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">One reassuring message every morning. Like a friend who gets it, without pretending parenting is easy.</p>
      </div>
      {saved ? (
        <div className="flex items-center gap-2 rounded-card border border-success/25 bg-[#f1fff6] px-4 py-3 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-5 w-5 text-success" /> Your daily peace email is set for {settings?.time || "08:00"}.
        </div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <form action={saveDailyPeace} className="space-y-5">
            <div>
              <Label htmlFor="time">Delivery time</Label>
              <select id="time" name="time" defaultValue={settings?.time || "08:00"} className="mt-2 h-11 w-full rounded-button border border-primary/15 bg-white px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/15">
                {["06:00", "07:00", "08:00", "09:00", "10:00"].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between rounded-[24px] bg-background p-5">
              <div>
                <p className="font-medium text-text-primary">Daily emails</p>
                <p className="text-sm text-text-secondary">{settings?.isActive === false ? "Turn it on when mornings need support." : "Your morning encouragement is ready."}</p>
              </div>
              <Switch name="isActive" defaultChecked={settings?.isActive ?? true} className="h-9 w-16 data-[state=checked]:bg-primary [&>span]:h-8 [&>span]:w-8 [&>span]:data-[state=checked]:translate-x-8" />
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
