"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import CairnMascot from "@/app/_components/cairn-mascot";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md pb-10">
      <div
        className="lang-wash pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
      />

      <div className="relative mb-5 flex justify-center">
        <CairnMascot
          className="h-20 w-auto"
          mood="idle"
          label="Cairn welcomes you back"
        />
      </div>

      <header className="relative text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Studio · Welcome back
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
          Sign in to Komorebi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your progress syncs across devices when you are signed in. You can still
          practice as a guest from the home screen.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="relative mt-8 space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
      >
        <div
          className="lang-wash pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
        />
        <div className="relative space-y-4">
          <div>
            <label
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>

      {process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true" && (
        <Button
          type="button"
          variant="outline"
          className="relative mt-3 w-full rounded-full"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Continue with Google
        </Button>
      )}

      <p className="relative mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <p className="relative mt-2 text-center text-sm">
        <Link
          href="/"
          className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Continue as guest
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-3 py-10">
          <CairnMascot
            className="h-16 w-auto"
            mood="thinking"
            label="Cairn is preparing sign in"
          />
          <p className="text-sm text-muted-foreground">Loading sign in…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
