import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-semibold text-text-primary", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
        <Heart className="h-4 w-4 fill-current" />
      </span>
      Nurturely
    </Link>
  );
}
