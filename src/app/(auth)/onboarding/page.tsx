"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { LANGUAGES } from "@/lib/languages";
import { syncProgressFromCloud } from "@/lib/progress";
import { saveLearningPrefs } from "@/lib/learning-prefs";

const GOALS = [
  { id: "travel", label: "Travel" },
  { id: "work", label: "Work" },
  { id: "school", label: "School" },
  { id: "fun", label: "For fun" },
  { id: "family", label: "Family & friends" },
  { id: "other", label: "Something else" },
] as const;

const MINUTES = [5, 10, 15, 20, 30];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(session?.user?.name ?? "");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [learningLanguage, setLearningLanguage] = useState("fr");
  const [goal, setGoal] = useState<(typeof GOALS)[number]["id"]>("fun");
  const [dailyMinutes, setDailyMinutes] = useState(10);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (step === 0) return "What should we call you?";
    if (step === 1) return "Which languages matter?";
    if (step === 2) return "Why are you learning?";
    return "How much time each day?";
  }, [step]);

  const lessonHint = useMemo(() => {
    if (learningLanguage === "en") {
      return "Lessons will use French → English (you’re learning English).";
    }
    if (learningLanguage === "fr") {
      return "Lessons will use English → French (you’re learning French).";
    }
    return "Structured lessons currently focus on English ↔ French; other languages still work in Translate.";
  }, [learningLanguage]);

  const finish = async () => {
    setLoading(true);
    setError("");
    try {
      // Always persist locally so Lessons works for this device immediately
      saveLearningPrefs({ learningLanguage, nativeLanguage });

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || "Learner",
          nativeLanguage,
          learningLanguage,
          goal,
          dailyMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not save onboarding.");
        return;
      }

      await update({
        onboardingCompleted: true,
        learningLanguage,
        nativeLanguage,
        name: displayName.trim() || "Learner",
      });

      await syncProgressFromCloud();
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 0 && !displayName.trim()) {
        setError("Please enter a name.");
        return;
      }
      setError("");
      setStep((s) => s + 1);
      return;
    }
    void finish();
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Setup · {step + 1} of 4
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A short setup so Koze can personalize practice. You can change this later.
      </p>

      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              "h-1 flex-1 rounded-full " +
              (i <= step ? "bg-primary" : "bg-muted")
            }
          />
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {step === 0 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="displayName">
              Display name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex"
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="native">
                I speak
              </label>
              <select
                id="native"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="learning">
                I am learning
              </label>
              <select
                id="learning"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">{lessonHint}</p>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                className={
                  "rounded-xl border p-3 text-left text-sm shadow-soft " +
                  (goal === g.id
                    ? "border-primary bg-accent"
                    : "border-border bg-card")
                }
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDailyMinutes(m)}
                className={
                  "rounded-full border px-4 py-2 text-sm " +
                  (dailyMinutes === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card")
                }
              >
                {m} min
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2 pt-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
            >
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1" size="lg" disabled={loading}>
            {loading ? "Saving…" : step === 3 ? "Finish" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
