"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Moon, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/ask", label: "Ask", icon: MessageCircle },
  { href: "/dashboard/stories", label: "Stories", icon: Moon },
  { href: "/dashboard/activities", label: "Activities", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/10 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_35px_rgba(27,67,50,0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-1 rounded-button px-1 py-2 text-[11px] font-semibold text-text-secondary transition",
                active && "bg-primary-light text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
              {active ? <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
