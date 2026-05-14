import Stripe from "stripe";
import { assertEnv } from "@/lib/utils";

let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    stripe = new Stripe(assertEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-02-24.acacia",
      typescript: true
    });
  }
  return stripe;
}
