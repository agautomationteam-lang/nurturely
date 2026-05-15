"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-text-primary">
      <section className="max-w-md rounded-card border border-primary/10 bg-white p-6 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase text-primary">Nurturely paused</p>
        <h1 className="mt-3 text-2xl font-semibold">Something needs a quick reset.</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          The page hit a server hiccup. Your account is safe, and trying again usually gets things moving.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-text-secondary">Reference: {error.digest}</p> : null}
        <Button className="mt-5" onClick={reset}>Try again</Button>
      </section>
    </main>
  );
}
