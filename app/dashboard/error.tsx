"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <p className="text-sm font-semibold uppercase text-primary">Dashboard needs a moment</p>
      <h1 className="mt-3 text-2xl font-semibold text-text-primary">We could not load this dashboard view.</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        This can happen while account data is being created or the database is waking up. Please try again.
      </p>
      {error.digest ? <p className="mt-3 text-xs text-text-secondary">Reference: {error.digest}</p> : null}
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </Card>
  );
}
