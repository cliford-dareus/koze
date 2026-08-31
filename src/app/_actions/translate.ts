"use server";

import { auth } from "@/auth";
import { getRandomFallbackWord } from "@/data/words";
import { connectDB } from "@/lib/db";
import { defaultProgress, type ProgressState } from "@/lib/progress";
import { User } from "@/models/User";

function getTodayDateString(date: Date = new Date()): string {
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export const translate = async (text: string, from: string, to: string) => {
    try {
        // Prefer relative URL so it works in local dev and production
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
            "https://uselessfacts.jsph.pl/random.json?language=en",
            {
                method: "GET",
                cache: "no-store",
            },
        );
        const result = await response.json();
        return {
            text:
                result.text ||
                result.text_short ||
                result.text_long ||
                result.text,
            author: result.source || result.author,
        };
    } catch (error) { }
}

// export async function getDefinition(word: string) {
//     const url = new URL("https://api.mymemory.translated.net/get");
//     url.searchParams.set("q", word);
//     url.searchParams.set("langpair", "en|en");

//     try {
//         const response = await fetch(
//             url.toString(),
//             {
//                 method: "GET",
//             },
//         );

//         if (!response.ok) return { ok: false as const, error: "Translation is unavailable." };

//         const body = (await response.json()) as {
//             responseData?: { translatedText?: string };
//         };
//         const translated = body.responseData?.translatedText?.trim();

//         if (!translated) return { ok: false as const, error: "No translation returned." };

//         return { ok: true as const, text: translated };
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getDefinition(word: string) {
    try {
        const url = new URL(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const response = await fetch(
            url,
            {
                method: "GET",
            },
        );

        if (!response.ok) return { ok: false as const, error: "Definition is unavailable." };

        const body = (await response.json()) as {
            meanings: {
                partOfSpeech: string;
                definitions: {
                    definition: string;
                    example: string;
                }[];
            }[];
        };

        return { ok: true as const, data: body.meanings };
    } catch (error) {
        console.log(error);
        return { ok: false as const, error: "Definition is unavailable." };
    }
}

export async function getRandomWord() {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false as const, error: 'Unauthorized' };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
        return { ok: false as const, error: 'User not found' };
    }

    try {
        const now = new Date();
        const todayStr = getTodayDateString(now);
        const current = user.progress ?? defaultProgress();

        // Return cached word for today if available
        if (current.currentWord && current.currentWordDate === todayStr) {
            return { ok: true as const, text: current.currentWord };
        }

        // Optional: enforce "one word per 24h" using lastActiveDate
        if (current.lastActiveDate) {
            const last = new Date(current.lastActiveDate);
            const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
            if (diffHours < 24) {
                return {
                    ok: false as const,
                    error: 'You must wait before getting a new word.',
                };
            }
        }

        // Try external API first
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        let word: string | null = null;

        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word', {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    Accept: 'application/json',
                },
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const body = (await response.json()) as unknown;
                if (typeof body === 'string' && body.trim().length > 0) {
                    word = body.trim();
                } else if (Array.isArray(body) && typeof body[0] === 'string') {
                    word = (body[0] as string).trim();
                }
            }
        } catch {
            clearTimeout(timeoutId);
            // Ignore; we'll fall back to local list
        }

        // Fallback to built-in list if API failed or returned nothing
        if (!word) {
            word = getRandomFallbackWord();
        }

        // Cache the word for today
        const updatedProgress = {
            ...current,
            lastActiveDate: now.toISOString(),
            currentWord: word,
            currentWordDate: todayStr,
        };

        await User.findByIdAndUpdate(session.user.id, { progress: updatedProgress });

        return { ok: true as const, text: word };
    } catch (error) {
        // Even on unexpected errors, you can still return a fallback word
        // if you want the feature to be highly resilient.
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

        await User.findByIdAndUpdate(session.user.id, { progress: updatedProgress });

        return { ok: true as const, text: word };
    }
}
