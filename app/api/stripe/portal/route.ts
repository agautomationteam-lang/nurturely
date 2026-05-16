import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://nurturely-nu.vercel.app";
}

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    if (!user.subscription?.stripeCustomerId) return NextResponse.json({ error: "Payment service unavailable, try again" }, { status: 404 });
    const origin = request.headers.get("origin") || appBaseUrl();
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${origin}/dashboard/settings`
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    console.error("Stripe portal error", error);
    return NextResponse.json({ error: "Payment service unavailable, try again" }, { status: 503 });
  }
}
