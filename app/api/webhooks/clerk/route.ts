import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";
import { assertEnv, localDateKey } from "@/lib/utils";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
};

type ClerkWebhookEvent = {
  type: "user.created" | "user.deleted" | string;
  data: ClerkUserPayload;
};

function getPrimaryEmail(user: ClerkUserPayload) {
  const primary = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
  return primary?.email_address || user.email_addresses?.[0]?.email_address || "";
}

function getDisplayName(user: ClerkUserPayload) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || null;
}

export async function POST(request: Request) {
  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") || "",
    "svix-timestamp": request.headers.get("svix-timestamp") || "",
    "svix-signature": request.headers.get("svix-signature") || ""
  };

  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(assertEnv("CLERK_WEBHOOK_SECRET")).verify(payload, headers) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid Clerk webhook signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const email = getPrimaryEmail(event.data);
    await prisma.user.upsert({
      where: { clerkUserId: event.data.id },
      create: {
        clerkUserId: event.data.id,
        email,
        name: getDisplayName(event.data),
        deletedAt: null,
        subscription: { create: { status: "FREE" } },
        usage: { create: { date: localDateKey("UTC") } }
      },
      update: {
        email,
        name: getDisplayName(event.data),
        deletedAt: null
      }
    });
  }

  if (event.type === "user.deleted") {
    await prisma.user.updateMany({
      where: { clerkUserId: event.data.id },
      data: { deletedAt: new Date(), dailyPeaceEnabled: false }
    });
  }

  return NextResponse.json({ received: true });
}
