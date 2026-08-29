"use client";

import { LucideChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PageTopSection = () => {
  const pathname = usePathname();
  const title =
    pathname.slice(1, 2).toUpperCase() + pathname.slice(2).replace(/-/g, " ");

  return (
    <div className="flex items-center justify-between py-2">
      <Link
        href="/"
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft"
        aria-label="Back home"
      >
        <LucideChevronLeft size={18} />
      </Link>

      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="size-10" />
    </div>
  );
};

export default PageTopSection;
