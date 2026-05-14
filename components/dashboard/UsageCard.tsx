import { Progress } from "@/components/ui/progress";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

export function UsageCard({ used, plan }: { used: number; plan: string }) {
  const pct = Math.min(100, (used / FREE_DAILY_LIMIT) * 100);
  const unlimited = plan === "ACTIVE";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s calm moments</CardTitle>
        <CardDescription>
          {unlimited ? "You have unlimited AI interactions today." : `You've used ${used} of ${FREE_DAILY_LIMIT} free questions today.`}
        </CardDescription>
      </CardHeader>
      <Progress value={unlimited ? 100 : pct} />
      <p className="mt-3 text-sm text-text-secondary">{unlimited ? "Peace Mode is active." : `${Math.max(0, FREE_DAILY_LIMIT - used)} free interactions remaining.`}</p>
    </Card>
  );
}
