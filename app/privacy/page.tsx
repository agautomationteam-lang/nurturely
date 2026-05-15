import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <article className="mt-8 rounded-[28px] bg-white p-6 shadow-soft md:p-10">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-text-secondary">Effective May 15, 2026</p>
          <div className="mt-8 space-y-6 leading-7 text-text-secondary">
            <p>Nurturely collects account information, usage activity, and the parenting prompts you choose to submit so we can provide AI parenting support, bedtime stories, activity ideas, Daily Peace emails, billing, and account security.</p>
            <p>Parenting prompts may include sensitive family details. Do not submit emergency medical information, legal claims, or information you do not want processed by our AI providers. Nurturely does not diagnose medical conditions and is not a replacement for pediatric, mental health, legal, or emergency services.</p>
            <p>We use service providers including Clerk for authentication, Supabase/Postgres for storage, OpenAI for AI generation, Stripe for payments, Resend for email delivery, and Vercel for hosting. These providers process data only as needed to operate the service.</p>
            <p>We retain your account and generated content while your account is active unless deletion is requested. You can request deletion or correction of account data by contacting support.</p>
            <p>We do not sell personal information. We may disclose information if required by law, to protect the service, or to prevent abuse.</p>
          </div>
          <Link className="mt-8 inline-block font-semibold text-primary" href="/">Back to Nurturely</Link>
        </article>
      </div>
    </main>
  );
}
