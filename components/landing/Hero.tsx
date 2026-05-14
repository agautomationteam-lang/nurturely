import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-content gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-6 lg:pt-16">
      <div className="space-y-7">
        <div className="inline-flex rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary">
          Type a worry. Get peace of mind in 10 seconds.
        </div>
        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Parenting is hard. Getting peace of mind shouldn&apos;t be.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-text-secondary">
            Nurturely gives parents warm, practical AI support for worries, bedtime stories, activity ideas, and morning encouragement.
          </p>
        </div>
        <div className="flex max-w-xl flex-col gap-3 rounded-card border border-primary/10 bg-white p-2 shadow-soft sm:flex-row">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-text-secondary" />
            <Input className="border-0 pl-10 shadow-none focus:ring-0" placeholder="parent@example.com" type="email" />
          </div>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button variant="accent" size="lg">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="accent" size="lg">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
      <div className="relative min-h-[430px] overflow-hidden rounded-[32px] bg-primary-light p-5 shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,162,97,0.35),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(82,183,136,0.35),transparent_28%)]" />
        <div className="relative flex h-full flex-col justify-end gap-4">
          <div className="max-w-sm rounded-card bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-primary">You asked</p>
            <p className="mt-2 text-text-primary">My 4-year-old melts down every night at bedtime. Is this normal?</p>
          </div>
          <div className="ml-auto max-w-md rounded-card bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-primary">Nurturely</p>
            <p className="mt-2 leading-7 text-text-primary">
              That sounds exhausting, and also very common. Bedtime asks kids to separate, settle their bodies, and let go of the day all at once.
            </p>
            <p className="mt-3 rounded-button bg-primary-light px-3 py-2 text-sm font-medium text-primary">
              Tonight: try one predictable 10-minute routine and one loving phrase you repeat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
