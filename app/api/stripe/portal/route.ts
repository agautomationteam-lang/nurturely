import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

const APP_BASE_URL = "https://nurturely.vercel.app";

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    if (!user.subscription?.stripeCustomerId) return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 });
    const origin = request.headers.get("origin") || APP_BASE_URL;
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${origin}/dashboard/settings`
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not open portal" }, { status: 400 });
  }
}
