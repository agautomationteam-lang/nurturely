import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreditCard, ShieldAlert } from "lucide-react";
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
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Settings</h1>
        <p className="mt-2 text-text-secondary">Account, subscription, and billing controls.</p>
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-text-primary">Account</h2>
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
          <Label htmlFor="timezone">Local timezone</Label>
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
        <Button className="mt-4" variant="danger">Delete account</Button>
      </Card>
    </div>
  );
}
