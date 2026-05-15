import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="h-28 animate-pulse rounded-[28px] bg-primary-light" />
      <Card>
        <div className="h-5 w-48 animate-pulse rounded-full bg-primary-light" />
        <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-primary-light" />
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Card key={item}>
            <div className="h-8 w-8 animate-pulse rounded-full bg-primary-light" />
            <div className="mt-4 h-5 w-28 animate-pulse rounded-full bg-primary-light" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-primary-light" />
          </Card>
        ))}
      </div>
    </div>
  );
}
