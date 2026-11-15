"use client";

import Link from "next/link";

/** Temporary shell while full sanctuary redesign is applied. */
export default function PracticePage() {
  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col pb-10">
      <div className="lang-wash pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <header className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Studio · Practice
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
          A patient conversation.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The full sanctuary redesign is ready — replace this file with{" "}
          <code className="text-xs">artifacts/practice-page.tsx</code> from the
          redesign session, or wait for the complete commit.
        </p>
      </header>
      <Link
        href="/chat"
        className="relative mt-6 text-sm font-medium text-primary hover:underline"
      >
        Back to practice home
      </Link>
    </div>
  );
}
