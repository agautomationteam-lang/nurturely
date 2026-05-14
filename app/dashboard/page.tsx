import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Heart, MessageCircle, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UsageCard } from "@/components/dashboard/UsageCard";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { requireAppUser } from "@/lib/auth";
import { getUsageForToday, totalUsage } from "@/lib/usage";

const actions = [
  { href: "/dashboard/ask", title: "Ask Anything", icon: MessageCircle, text: "Bring one worry and get a steady next step." },
  { href: "/dashboard/stories", title: "Bedtime Story", icon: Moon, text: "Create a cozy story in your child's world." },
  { href: "/dashboard/activities", title: "Activity Ideas", icon: Sparkles, text: "Find simple play that fits the day." },
  { href: "/dashboard/peace", title: "Daily Peace", icon: Heart, text: "Set up a morning message that meets you gently." }
];

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const appUser = await requireAppUser();
  const usage = await getUsageForToday(appUser.clerkUserId, appUser.timezone);
  const used = totalUsage(usage);
  const plan = appUser.subscription?.status || "FREE";
  const recent = await Promise.all([
    import("@/lib/db").then(({ prisma }) => prisma.chat.findMany({ where: { userId: appUser.clerkUserId }, orderBy: { createdAt: "desc" }, take: 1 })),
    import("@/lib/db").then(({ prisma }) => prisma.story.findMany({ where: { userId: appUser.clerkUserId }, orderBy: { createdAt: "desc" }, take: 1 })),
    import("@/lib/db").then(({ prisma }) => prisma.activity.findMany({ where: { userId: appUser.clerkUserId }, orderBy: { createdAt: "desc" }, take: 1 }))
  ]);
  const history = [
    ...recent[0].map((item) => ({ type: "Question", text: item.question })),
    ...recent[1].map((item) => ({ type: "Story", text: `${item.childName} and ${item.theme}` })),
    ...recent[2].map((item) => ({ type: "Activity", text: `${item.duration} minutes, ${item.location}` }))
  ].slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-primary p-6 text-white shadow-soft">
        <p className="text-sm text-primary-light">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold">Hi {clerkUser?.firstName || appUser.name || "there"}, what needs calming today?</h1>
      </section>
      <UsageCard used={used} plan={plan} />
      {plan === "FREE" && used >= 2 ? <UpgradeBanner /> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full transition hover:scale-[1.02] hover:shadow-xl">
              <action.icon className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-lg font-semibold text-text-primary">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{action.text}</p>
            </Card>
          </Link>
        ))}
      </section>
      <Card>
        <h2 className="text-lg font-semibold text-text-primary">Recent history</h2>
        {history.length ? (
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <div key={`${item.type}-${item.text}`} className="rounded-button bg-background p-3">
                <p className="text-xs font-semibold uppercase text-primary">{item.type}</p>
                <p className="mt-1 text-sm text-text-primary">{item.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-secondary">Your first calm moment will appear here.</p>
        )}
      </Card>
    </div>
  );
}
