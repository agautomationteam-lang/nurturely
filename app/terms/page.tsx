import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-3xl">
        <Logo />
        <article className="mt-8 rounded-[28px] bg-white p-6 shadow-soft md:p-10">
          <h1 className="text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-text-secondary">Effective May 15, 2026</p>
          <div className="mt-8 space-y-6 leading-7 text-text-secondary">
            <p>Nurturely provides AI-assisted parenting support for general informational and emotional support purposes. It is not medical, mental health, legal, educational, or emergency advice.</p>
            <p>You are responsible for how you use Nurturely responses. For urgent concerns, injury, fever, rash, safety risks, developmental concerns, or mental health emergencies, contact a qualified professional or emergency services.</p>
            <p>You agree not to misuse the service, attempt to reverse engineer it, submit unlawful content, or use it to make decisions that require professional judgment without consulting an appropriate professional.</p>
            <p>Paid subscriptions are processed by Stripe. Plans renew monthly unless canceled. You can manage billing through the Stripe Customer Portal when subscribed.</p>
            <p>We may modify, suspend, or discontinue features as the product evolves. Continued use means you accept the current terms.</p>
          </div>
          <Link className="mt-8 inline-block font-semibold text-primary" href="/">Back to Nurturely</Link>
        </article>
      </div>
    </main>
  );
}
