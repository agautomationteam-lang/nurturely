"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, MessageCircle, Moon, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/ask", label: "Ask", icon: MessageCircle },
  { href: "/dashboard/stories", label: "Story", icon: Moon },
  { href: "/dashboard/activities", label: "Play", icon: Sparkles },
  { href: "/dashboard/peace", label: "Peace", icon: Heart },
  { href: "/dashboard/settings", label: "Account", icon: Settings }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/10 bg-white/95 px-2 py-2 shadow-[0_-12px_35px_rgba(27,67,50,0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-button px-1 py-2 text-[11px] font-semibold text-text-secondary",
                active && "bg-primary-light text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
