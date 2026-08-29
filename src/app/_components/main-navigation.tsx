"use client";

import {
  LucideBookOpen,
  LucideHome,
  LucideLanguages,
  LucideMessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home", icon: LucideHome },
  { href: "/translation", label: "Translate", icon: LucideLanguages },
  { href: "/listening", label: "Listen", icon: LucideBookOpen },
  { href: "/chat", label: "Practice", icon: LucideMessageCircle },
] as const;

const MainNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      <div className="pointer-events-auto mx-auto max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:max-w-3xl">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-2 py-2 shadow-soft">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors " +
                  (active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
