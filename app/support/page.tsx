import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";

const faqs = [
  ["How do I cancel?", "Open Dashboard > Settings and choose Manage Billing. Stripe handles plan changes and cancellations securely."],
  ["What does the free plan include?", "Free parents get 3 AI interactions per day across Ask, Stories, and Activities, plus Daily Peace setup."],
  ["How do Daily Peace emails work?", "Choose a preferred delivery time and turn Daily Peace on. Nurturely sends a short reassuring email when scheduled."],
  ["How private is my data?", "We store account, usage, chat, story, activity, and Daily Peace data to operate the product. We do not sell personal data."],
  ["Is Nurturely always accurate?", "No AI is perfect. Nurturely offers general parenting support, not medical, legal, emergency, or mental health advice."]
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-4xl">
        <Logo />
        <section className="mt-8 rounded-[28px] bg-primary p-7 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Support</p>
          <h1 className="mt-2 text-4xl font-semibold">Help for calmer setup</h1>
          <p className="mt-4 max-w-2xl text-white/80">For direct help, email <a className="font-semibold text-primary-light" href="mailto:agautomationteam@gmail.com">agautomationteam@gmail.com</a>.</p>
        </section>
        <div className="mt-6 grid gap-4">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h2 className="text-lg font-semibold text-text-primary">{question}</h2>
              <p className="mt-2 leading-7 text-text-secondary">{answer}</p>
            </Card>
          ))}
        </div>
        <Link className="mt-8 inline-block rounded-button bg-primary px-5 py-3 font-semibold text-white" href="/contact">Contact us</Link>
      </div>
    </main>
  );
}
