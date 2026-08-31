"use client";

import { LucideChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  translation: "Translate",
  reading: "Reading",
  listening: "Listening",
  chat: "Practice",
  lessons: "Lessons",
};

function titleFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  if (TITLES[segment]) return TITLES[segment];
  if (!segment) return "Koze";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

const PageTopSection = () => {
  const pathname = usePathname();
  const title = titleFromPath(pathname);
  const parent =
    pathname.startsWith("/chat/") && pathname !== "/chat"
      ? "/chat"
      : "/";

  return (
    <div className="flex shrink-0 items-center justify-between py-1">
      <Link
        href={parent}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-colors hover:bg-muted"
        aria-label={parent === "/" ? "Back home" : "Back to practice"}
      >
        <LucideChevronLeft size={18} />
      </Link>

      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="size-10" aria-hidden />
    </div>
  );
};

export default PageTopSection;
