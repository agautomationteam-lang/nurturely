import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Heart, MessageCircle, Moon, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UsageCard } from "@/components/dashboard/UsageCard";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { requireAppUser } from "@/lib/auth";
import { getUsageForToday, totalUsage } from "@/lib/usage";

const actions = [
  { href: "/dashboard/ask", title: "I need help with a worry", icon: MessageCircle, text: "Sleep, food, behavior, emotions, school. Get one steady next step.", cta: "Ask Calm Coach" },
  { href: "/dashboard/stories", title: "Bedtime needs softening", icon: Moon, text: "Make a cozy story starring your child, built for winding down.", cta: "Create story" },
  { href: "/dashboard/activities", title: "We need something to do", icon: Sparkles, text: "Find simple play that fits age, time, place, and energy.", cta: "Find play ideas" },
  { href: "/dashboard/peace", title: "Tomorrow needs a gentler start", icon: Heart, text: "Save a morning encouragement that lands like a thoughtful friend.", cta: "Set Daily Peace" }
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
      <section className="overflow-hidden rounded-[32px] bg-primary text-white shadow-soft">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_320px] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Welcome back</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Hi {clerkUser?.firstName || appUser.name || "there"}, what kind of support would help right now?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
              Nurturely is here for the small-but-heavy parenting moments: the worry, the bedtime spiral, the bored afternoon, the morning reset.
            </p>
          </div>
          <div className="rounded-[24px] bg-white/12 p-5">
            <ShieldCheck className="h-7 w-7 text-primary-light" />
            <p className="mt-4 text-lg font-semibold">Calm Coach promise</p>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Warm first. Practical second. Clear about when a doctor, therapist, or teacher should be involved.
            </p>
          </div>
        </div>
      </section>
      <UsageCard used={used} plan={plan} />
      {plan === "FREE" && used >= 2 ? <UpgradeBanner /> : null}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-text-primary">Choose your calm path</h2>
          <p className="mt-1 text-text-secondary">Each tool is designed for a specific parent moment, not a generic chatbot screen.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group h-full transition hover:scale-[1.02] hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-light">
                <action.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-text-primary">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{action.text}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {action.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </p>
            </Card>
          </Link>
        ))}
        </div>
      </section>
      <Card>
        <h2 className="text-lg font-semibold text-text-primary">Recently supported</h2>
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
          <p className="mt-3 text-sm text-text-secondary">After your first ask, story, or activity, this becomes a quick trail back to what helped.</p>
        )}
      </Card>
    </div>
  );
}
