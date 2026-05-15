"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Home, LogOut, MessageCircle, Moon, Settings, Sparkles, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { cn, initials } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/ask", label: "Worry Coach", icon: MessageCircle },
  { href: "/dashboard/stories", label: "Bedtime Stories", icon: Moon },
  { href: "/dashboard/activities", label: "Play Ideas", icon: Sparkles },
  { href: "/dashboard/peace", label: "Daily Peace", icon: Heart },
  { href: "/dashboard/settings", label: "Account", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-primary/10 bg-white p-5 lg:flex">
      <Logo />
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
            className={cn("flex items-center gap-3 rounded-button px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-primary", active && "bg-primary-light text-primary")}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-card border border-primary/10 bg-background p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{initials(user?.fullName, user?.primaryEmailAddress?.emailAddress)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{user?.firstName || "Parent"}</p>
            <p className="truncate text-xs text-text-secondary">Nurturely member</p>
          </div>
        </div>
        <SignOutButton redirectUrl="/">
          <Button className="mt-3 w-full" variant="ghost" size="sm">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  );
}
