import { Progress } from "@/components/ui/progress";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

export function UsageCard({ used, plan }: { used: number; plan: string }) {
  const pct = Math.min(100, (used / FREE_DAILY_LIMIT) * 100);
  const unlimited = plan === "ACTIVE";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s free AI moments</CardTitle>
        <CardDescription>
          {unlimited ? "Peace Mode is active. Ask, create, and reset as often as you need." : `You've used ${used} of ${FREE_DAILY_LIMIT} free interactions today.`}
        </CardDescription>
      </CardHeader>
      <Progress value={unlimited ? 100 : pct} />
      <p className="mt-3 text-sm text-text-secondary">{unlimited ? "You are covered." : `${Math.max(0, FREE_DAILY_LIMIT - used)} calm moments remaining before upgrade is needed.`}</p>
    </Card>
  );
}
