import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <article className="mt-8 rounded-[28px] bg-white p-6 shadow-soft md:p-10">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-text-secondary">Effective May 15, 2026. Contact: <a className="font-semibold text-primary" href="mailto:agautomationteam@gmail.com">agautomationteam@gmail.com</a>.</p>
          <div className="mt-8 space-y-6 leading-7 text-text-secondary">
            <p><strong>Data we collect.</strong> We collect name, email address, authentication identifiers, subscription status, usage counts, chat history, story and activity generation history, Daily Peace email settings, support messages, and technical data needed for security and debugging.</p>
            <p><strong>How we use data.</strong> We use this information to create AI responses, generate stories and activities, send Daily Peace emails, manage billing, enforce free plan limits, provide support, protect accounts, and improve reliability.</p>
            <p><strong>Third parties.</strong> Nurturely uses Clerk for authentication, Stripe for payments, OpenAI for AI generation, Supabase/Postgres for database storage, Resend for email delivery, and Vercel for hosting and deployment.</p>
            <p><strong>Retention.</strong> We retain account and product data while your account is active. We may keep billing, security, and legal records as required by law. You may request access, correction, export, or deletion by emailing us.</p>
            <p><strong>Canadian privacy law.</strong> Nurturely is operated with Canadian privacy principles in mind, including PIPEDA-style consent, limited collection, safeguards, access rights, and accountability. We also support GDPR-style requests for access, correction, deletion, portability, and objection where applicable.</p>
            <p><strong>Sensitive content.</strong> Parenting prompts may include personal family details. Do not submit emergency medical, legal, or crisis information. Nurturely is not a pediatrician, therapist, lawyer, or emergency service.</p>
            <p><strong>No sale of data.</strong> We do not sell personal information. We may disclose data when required by law, to prevent abuse, or to operate the service through our vendors.</p>
          </div>
          <Link className="mt-8 inline-block font-semibold text-primary" href="/">Back to Nurturely</Link>
        </article>
      </div>
    </main>
  );
}
