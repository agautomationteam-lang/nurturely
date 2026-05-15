"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/shared/Logo";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <Logo />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
