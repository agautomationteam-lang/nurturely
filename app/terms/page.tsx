import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <article className="mt-8 rounded-[28px] bg-white p-6 shadow-soft md:p-10">
          <h1 className="text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-text-secondary">Effective May 15, 2026. Contact: <a className="font-semibold text-primary" href="mailto:agautomationteam@gmail.com">agautomationteam@gmail.com</a>.</p>
          <div className="mt-8 space-y-6 leading-7 text-text-secondary">
            <p><strong>Service.</strong> Nurturely provides AI-assisted parenting support, bedtime stories, activity ideas, and Daily Peace emails for general informational and emotional support.</p>
            <p><strong>Plans.</strong> The free plan includes limited daily AI interactions. Paid Peace Mode and Family Mode plans provide expanded or unlimited access as described on the pricing page, subject to fair use and platform availability.</p>
            <p><strong>No medical advice.</strong> Nurturely is not medical, mental health, legal, educational, or emergency advice. For fever, injury, rash, safety risks, developmental concerns, mental health concerns, or emergencies, contact a qualified professional or emergency services.</p>
            <p><strong>Refunds.</strong> We offer a 7 day money back guarantee for first-time paid subscribers. Email agautomationteam@gmail.com with your account email to request a refund.</p>
            <p><strong>Cancellation.</strong> Subscriptions renew monthly unless canceled. You can cancel through the Stripe Customer Portal in Settings. Access continues until the end of the paid billing period unless otherwise required by law.</p>
            <p><strong>Acceptable use.</strong> Do not misuse the service, submit unlawful content, attempt to reverse engineer it, or rely on AI output for decisions requiring professional judgment.</p>
            <p><strong>Governing law.</strong> These terms are governed by the laws of Alberta, Canada, and applicable Canadian federal law.</p>
          </div>
          <Link className="mt-8 inline-block font-semibold text-primary" href="/">Back to Nurturely</Link>
        </article>
      </div>
    </main>
  );
}
