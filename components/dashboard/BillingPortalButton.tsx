"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BillingPortalButton({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const response = await fetch(hasCustomer ? "/api/stripe/portal" : "/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment service unavailable, try again");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment service unavailable, try again");
    } finally {
      setLoading(false);
    }
  }

  return <Button onClick={openPortal} disabled={loading}>{loading ? "Opening..." : hasCustomer ? "Manage Subscription" : "Upgrade to Peace Mode"}</Button>;
}
