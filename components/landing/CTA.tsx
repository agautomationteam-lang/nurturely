import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="rounded-[28px] bg-primary p-8 text-center shadow-soft md:p-14">
        <h2 className="text-3xl font-semibold text-white">Start Your First Calm Moment — Free</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">Every parent deserves a calm moment. Nurturely is ready whenever the worry shows up.</p>
        <SignUpButton mode="modal">
          <Button className="mt-7" variant="accent" size="lg">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
        </SignUpButton>
      </div>
    </section>
  );
}
