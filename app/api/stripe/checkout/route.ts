import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://nurturely-nu.vercel.app";
}

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const { priceId } = await request.json();
    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return NextResponse.json({ error: "Payment service unavailable, try again" }, { status: 503 });
    }
    const origin = request.headers.get("origin") || appBaseUrl();
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: user.subscription?.stripeCustomerId || undefined,
      customer_email: user.subscription?.stripeCustomerId ? undefined : user.email,
      client_reference_id: user.clerkUserId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: { userId: user.clerkUserId }
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Payment service unavailable, try again" }, { status: 503 });
  }
}
