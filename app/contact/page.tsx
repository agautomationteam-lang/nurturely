import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/shared/Logo";
import { getResend } from "@/lib/resend";

async function sendContact(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !email || !message) redirect("/contact?error=missing");

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Nurturely <daily@nurturely.app>",
    to: "agautomationteam@gmail.com",
    replyTo: email,
    subject: `Nurturely contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  redirect("/contact?sent=1");
}

export default async function ContactPage({ searchParams }: { searchParams?: Promise<{ sent?: string; error?: string }> }) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary">
      <div className="mx-auto max-w-4xl">
        <Logo />
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] bg-primary p-7 text-white shadow-soft">
            <Mail className="h-9 w-9 text-primary-light" />
            <h1 className="mt-5 text-4xl font-semibold">We&apos;re here for you</h1>
            <p className="mt-4 leading-7 text-white/80">Questions, billing help, privacy requests, or product feedback all belong here.</p>
            <a className="mt-6 block font-semibold text-primary-light" href="mailto:agautomationteam@gmail.com">agautomationteam@gmail.com</a>
            <p className="mt-3 text-sm text-white/75">We reply within 24 hours.</p>
          </div>
          <Card>
            {params.sent ? <p className="mb-4 rounded-button bg-primary-light px-4 py-3 text-sm font-semibold text-primary">Message sent. We&apos;ll reply within 24 hours.</p> : null}
            {params.error ? <p className="mb-4 rounded-button bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">Please fill out every field.</p> : null}
            <form action={sendContact} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" className="mt-2" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" className="mt-2" type="email" required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" className="mt-2" required />
              </div>
              <Button type="submit" size="lg">Send message</Button>
            </form>
          </Card>
        </section>
        <Link className="mt-8 inline-block font-semibold text-primary" href="/">Back to Nurturely</Link>
      </div>
    </main>
  );
}
