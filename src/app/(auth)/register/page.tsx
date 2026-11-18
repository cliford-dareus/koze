"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import CairnMascot from "@/app/_components/cairn-mascot";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not create account.");
        return;
      }

      const sign = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (sign?.error) {
        setError("Account created — please sign in.");
        router.push("/login");
        return;
      }

      router.push("/onboarding");
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
          mood="encourage"
          label="Cairn welcomes a new learner"
        />
      </div>

      <header className="relative text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Studio · Get started
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
          Create your studio
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Save progress in the cloud and pick the languages you care about.
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
              htmlFor="name"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we greet you?"
              className="rounded-xl"
            />
          </div>
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
            {loading ? "Creating…" : "Create account"}
          </Button>
        </div>
      </form>

      <p className="relative mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
