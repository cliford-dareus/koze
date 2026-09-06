"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { syncProgressFromCloud } from "@/lib/progress";
import ThemeToggle from "@/app/_components/theme-toggle";

export default function AuthMenu() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      void syncProgressFromCloud();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        …
      </span>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <Link
          href="/profile"
          className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
        >
          Profile
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const label = session.user.name?.split(" ")[0] || "Account";

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle compact />
      <Link
        href="/profile"
        className="max-w-[8rem] truncate text-xs font-medium text-primary"
      >
        {label}
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
      >
        Sign out
      </button>
    </div>
  );
}
