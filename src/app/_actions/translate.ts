"use server";

import { auth } from "@/auth";
import { getRandomFallbackWord } from "@/data/words";
import { connectDB } from "@/lib/db";
import { fetchCollegiateThesaurus } from "@/lib/merriam-webster";
import { defaultProgress } from "@/lib/progress";
import { User } from "@/models/User";

function getTodayDateString(date: Date = new Date()): string {
    return date.toISOString().slice(0, 10);
}

export const translate = async (text: string, from: string, to: string) => {
    try {
        const base =
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "http://localhost:3000");

        const res = await fetch(`${base}/api/translate`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ text, from, to }),
        });

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export async function getQuote() {
    const category = "happiness";

    try {
        const response = await fetch(
            `https://api.api-ninjas.com/v2/quotes?category=${category}`,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "X-Api-Key": process.env.NINJA_API_KEY!,
                },
            },
        );
        const result = await response.json();
        return result[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getRandomFacts() {
    try {
        const response = await fetch(
            "https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom",
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "X-Api-Key": process.env.NINJA_API_KEY!,
                },
            },
        );
        const result = await response.json();
        return {
            text: result[0].quote,
            author: result[0].author,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * Look up a word via Merriam-Webster Collegiate® Thesaurus:
 * short definitions, synonyms, antonyms / near antonyms, examples.
 */
export async function getDefinition(word: string) {
    const apiKey =
        process.env.MERRIAM_WEBSTER_API_KEY ||
        process.env.MW_THESAURUS_API_KEY ||
        "";

    if (!apiKey) {
        return {
            ok: false as const,
            error:
                "Thesaurus is not configured. Add MERRIAM_WEBSTER_API_KEY to your environment.",
        };
    }

    try {
        const cleaned = word.replace(/^"|"$/g, "").trim();
        return await fetchCollegiateThesaurus(cleaned, apiKey);
    } catch (error) {
        console.log(error);
        return {
            ok: false as const,
            error: "Definition is unavailable.",
        };
    }
}

export async function getRandomWord() {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false as const, error: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
        return { ok: false as const, error: "User not found" };
    }

    try {
        const now = new Date();
        const todayStr = getTodayDateString(now);
        const current = user.progress ?? defaultProgress();

        if (current.currentWord && current.currentWordDate === todayStr) {
            return { ok: true as const, text: current.currentWord };
        }

        if (current.lastActiveDate) {
            const last = new Date(current.lastActiveDate);
            const diffHours =
                (now.getTime() - last.getTime()) / (1000 * 60 * 60);
            if (diffHours < 24) {
                return {
                    ok: false as const,
                    error: "You must wait before getting a new word.",
                };
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        let word: string | null = null;

        try {
            const response = await fetch(
                "https://random-word-api.herokuapp.com/word",
                {
                    method: "GET",
                    signal: controller.signal,
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            clearTimeout(timeoutId);

            if (response.ok) {
                const body = (await response.json()) as unknown;
                if (typeof body === "string" && body.trim().length > 0) {
                    word = body.trim();
                } else if (Array.isArray(body) && typeof body[0] === "string") {
                    word = (body[0] as string).trim();
                }
            }
        } catch {
            clearTimeout(timeoutId);
        }

        if (!word) {
            word = getRandomFallbackWord();
        }

        const updatedProgress = {
            ...current,
            lastActiveDate: now.toISOString(),
            currentWord: word,
            currentWordDate: todayStr,
        };

        await User.findByIdAndUpdate(session.user.id, {
            progress: updatedProgress,
        });

        return { ok: true as const, text: word };
    } catch (error) {
        const now = new Date();
        const todayStr = getTodayDateString(now);
        const current = user.progress ?? defaultProgress();
        const word = getRandomFallbackWord();

        const updatedProgress = {
            ...current,
            lastActiveDate: now.toISOString(),
            currentWord: word,
            currentWordDate: todayStr,
        };

        await User.findByIdAndUpdate(session.user.id, {
            progress: updatedProgress,
        });

        return { ok: true as const, text: word };
    }
}
