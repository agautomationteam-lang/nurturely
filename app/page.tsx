import Link from "next/link";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main>
      <header className="mx-auto flex max-w-content items-center justify-between px-4 py-5 md:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link className="hidden px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary sm:inline-block" href="#pricing">
            Pricing
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="accent">Get Started Free</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </nav>
      </header>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <footer className="mx-auto flex max-w-content flex-col gap-4 border-t border-primary/10 px-4 py-8 text-sm text-text-secondary md:flex-row md:items-center md:justify-between md:px-6">
        <p>© 2026 Nurturely. Built with love for parents.</p>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/support">Support</Link>
        </div>
        <a href="mailto:agautomationteam@gmail.com">agautomationteam@gmail.com</a>
      </footer>
    </main>
  );
}
