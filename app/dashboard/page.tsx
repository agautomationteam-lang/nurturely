import { currentUser } from "@clerk/nextjs/server";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { requireAppUser } from "@/lib/auth";
import { getUsageForToday, totalUsage } from "@/lib/usage";

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<{ upgraded?: string }> }) {
  const clerkUser = await currentUser();
  const appUser = await requireAppUser();
  const usage = await getUsageForToday(appUser.clerkUserId, appUser.timezone);
  const used = totalUsage(usage);
  const plan = appUser.subscription?.status || "FREE";
  const params = searchParams ? await searchParams : {};

  return (
    <div className="space-y-6">
      <DashboardHome firstName={clerkUser?.firstName || appUser.name || "there"} used={used} plan={plan} upgraded={params.upgraded === "true"} />
      {plan === "FREE" && used >= 2 ? <UpgradeBanner /> : null}
    </div>
  );
}
