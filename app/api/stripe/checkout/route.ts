import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://nurturely-nu.vercel.app";
}

function resolvePriceId(input: unknown, plan: unknown) {
  if (typeof input === "string" && input.startsWith("price_")) return input;
  if (plan === "peace") return process.env.STRIPE_PRICE_ID_PEACE || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "";
  if (plan === "family") return process.env.STRIPE_PRICE_ID_FAMILY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FAMILY || "";
  return "";
}

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const { priceId, plan } = await request.json();
    const resolvedPriceId = resolvePriceId(priceId, plan);
    if (!resolvedPriceId || !resolvedPriceId.startsWith("price_")) {
      return NextResponse.json({ error: `Stripe price is not configured for ${plan || "this plan"}. Add the correct price_ ID in Vercel.` }, { status: 503 });
    }
    const origin = request.headers.get("origin") || appBaseUrl();
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: user.subscription?.stripeCustomerId || undefined,
      customer_email: user.subscription?.stripeCustomerId ? undefined : user.email,
      client_reference_id: user.clerkUserId,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: { userId: user.clerkUserId }
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    console.error("Stripe checkout error", error);
    const message = error instanceof Error ? error.message : "Payment service unavailable, try again";
    return NextResponse.json({ error: `Stripe checkout failed: ${message}` }, { status: 503 });
  }
}
