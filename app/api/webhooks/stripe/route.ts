import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { assertEnv } from "@/lib/utils";

function mapStatus(status?: Stripe.Subscription.Status) {
  if (status === "active" || status === "trialing") return "ACTIVE";
  if (status === "past_due" || status === "unpaid") return "PAST_DUE";
  if (status === "canceled") return "CANCELED";
  return "FREE";
}

async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription, userId?: string | null, customerId?: string | null) {
  const resolvedUserId = userId || subscription.metadata.userId;
  if (!resolvedUserId) return;

  await prisma.subscription.upsert({
    where: { userId: resolvedUserId },
    create: {
      userId: resolvedUserId,
      stripeCustomerId: customerId || String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: mapStatus(subscription.status),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    },
    update: {
      stripeCustomerId: customerId || String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: mapStatus(subscription.status),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, assertEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook" }, { status: 400 });
  }

  try {
    await prisma.stripeEvent.create({ data: { id: event.id, type: event.type } });
  } catch {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (subscriptionId) {
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
      await upsertSubscriptionFromStripe(subscription, userId, String(session.customer));
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: event.type === "customer.subscription.deleted" ? "CANCELED" : mapStatus(subscription.status),
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  return NextResponse.json({ received: true });
}
