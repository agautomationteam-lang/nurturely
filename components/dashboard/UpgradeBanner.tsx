"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function UpgradeBanner() {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start checkout");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card bg-primary p-5 text-white shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-primary-light" />
          <div>
            <h2 className="font-semibold">You are close to today&apos;s free limit</h2>
            <p className="mt-1 text-sm text-white/80">Peace Mode unlocks unlimited asks, stories, activities, and Daily Peace emails for $19/month.</p>
          </div>
        </div>
        <Button onClick={upgrade} disabled={loading} variant="accent">
          {loading ? "Opening..." : "Upgrade"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
