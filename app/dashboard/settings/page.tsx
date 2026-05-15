import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreditCard, Globe2, ShieldAlert, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAppUser } from "@/lib/auth";
import { BillingPortalButton } from "@/components/dashboard/BillingPortalButton";
import { prisma } from "@/lib/db";

async function updateProfile(formData: FormData) {
  "use server";
  const user = await requireAppUser();
  const timezone = String(formData.get("timezone") || "UTC").trim() || "UTC";
  await prisma.user.update({
    where: { clerkUserId: user.clerkUserId },
    data: { timezone }
  });
  revalidatePath("/dashboard/settings");
}

export default async function SettingsPage() {
  const clerkUser = await currentUser();
  const appUser = await requireAppUser();
  const plan = appUser.subscription?.status || "FREE";

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-primary p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Account center</p>
        <h1 className="mt-2 text-3xl font-semibold">Settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Keep your profile, timezone, and subscription aligned so Nurturely resets usage and billing correctly.</p>
      </div>
      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary"><UserRound className="h-5 w-5 text-primary" /> Account</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-button bg-background p-4">
            <p className="text-sm text-text-secondary">Name</p>
            <p className="mt-1 font-medium text-text-primary">{clerkUser?.fullName || appUser.name || "Parent"}</p>
          </div>
          <div className="rounded-button bg-background p-4">
            <p className="text-sm text-text-secondary">Email</p>
            <p className="mt-1 font-medium text-text-primary">{clerkUser?.primaryEmailAddress?.emailAddress || appUser.email}</p>
          </div>
        </div>
        <form action={updateProfile} className="mt-5 max-w-md space-y-2">
          <Label htmlFor="timezone" className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> Local timezone</Label>
          <div className="flex gap-2">
            <Input id="timezone" name="timezone" defaultValue={appUser.timezone} placeholder="America/Edmonton" />
            <Button type="submit">Save</Button>
          </div>
          <p className="text-sm text-text-secondary">Free-tier usage resets at midnight in this timezone.</p>
        </form>
      </Card>
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary"><CreditCard className="h-5 w-5 text-primary" /> Subscription</h2>
            <p className="mt-2 text-text-secondary">Current plan: <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary">{plan}</span></p>
          </div>
          <BillingPortalButton hasCustomer={Boolean(appUser.subscription?.stripeCustomerId)} />
        </div>
        <div className="mt-5 rounded-button bg-background p-4 text-sm text-text-secondary">Billing history is available in the Stripe Customer Portal after your first checkout.</div>
      </Card>
      <Card className="border-danger/20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-danger"><ShieldAlert className="h-5 w-5" /> Danger zone</h2>
        <p className="mt-2 text-sm text-text-secondary">Delete account requests should be confirmed through support so child-related content can be removed carefully.</p>
        <Button className="mt-4" variant="danger" disabled>Contact support to delete</Button>
      </Card>
    </div>
  );
}
