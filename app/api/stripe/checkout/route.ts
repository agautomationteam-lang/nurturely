import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nurturely.vercel.app";

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const { priceId } = await request.json();
    if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    const origin = request.headers.get("origin") || APP_BASE_URL;
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: user.subscription?.stripeCustomerId || undefined,
      customer_email: user.subscription?.stripeCustomerId ? undefined : user.email,
      client_reference_id: user.clerkUserId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?success=1`,
      cancel_url: `${origin}/dashboard?canceled=1`,
      metadata: { userId: user.clerkUserId }
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create checkout session" }, { status: 400 });
  }
}
