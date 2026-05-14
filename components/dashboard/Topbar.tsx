"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Dashboard">
            <Link href="/dashboard">
              <Menu className="h-5 w-5" />
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
