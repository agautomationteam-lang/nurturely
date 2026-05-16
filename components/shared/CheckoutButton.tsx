"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

type CheckoutButtonProps = ButtonProps & {
  priceId?: string;
  plan?: "peace" | "family";
  children: React.ReactNode;
};

export function CheckoutButton({ priceId, plan, children, className, variant = "default", ...props }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    if (!priceId && !plan) {
      toast.error("Stripe price is not configured. Add the price ID in Vercel.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || "Payment service unavailable, try again");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment service unavailable, try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" className={className} variant={variant} onClick={startCheckout} disabled={loading || props.disabled} {...props}>
      {loading ? "Opening Stripe..." : children}
      {!loading ? <ArrowRight className="h-4 w-4" /> : null}
    </Button>
  );
}
