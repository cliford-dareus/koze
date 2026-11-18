import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { languageLabel } from "@/lib/languages";

const bodySchema = z.object({
    target: z.string().min(2).max(8),
    texts: z.array(z.string().min(1).max(600)).min(1).max(80),
});

/** Server cache: `${lang}::${text}` → translation. Survives warm lambdas. */
const cache = new Map<string, string>();

function cacheKey(lang: string, text: string) {
    return `${lang}::${text}`;
}

export async function POST(req: NextRequest) {
    try {
        const parsed = bodySchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid localize payload" },
                { status: 400 },
            );
        }

        const target = parsed.data.target.toLowerCase();
        const texts = parsed.data.texts;
        if (target === "en") {
            return NextResponse.json({ success: true, translations: texts });
        }

        const out: string[] = new Array(texts.length);
        const missing: { index: number; text: string }[] = [];
        texts.forEach((text, index) => {
            const hit = cache.get(cacheKey(target, text));
            if (hit) out[index] = hit;
            else missing.push({ index, text });
        });

        if (missing.length && process.env.GOOGLE_API_KEY) {
            const genAi = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
            const name = languageLabel(target);
            const numbered = missing
                .map((m, i) => `${i + 1}. ${m.text}`)
                .join("\n");
            const result = await genAi.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Translate each numbered line into ${name}. These are short language-lesson tips, prompts, and corrections. Keep any quoted target-language phrase unchanged. Return ONLY a JSON array of strings, same length and order, no markdown.\n\n${numbered}`,
                            },
                        ],
                    },
                ],
            });
            const raw = (result.text ?? "").trim().replace(/^```json\s*|```$/g, "");
            try {
                const arr = JSON.parse(raw) as unknown;
                if (Array.isArray(arr)) {
                    missing.forEach((m, i) => {
                        const translated =
                            typeof arr[i] === "string" && arr[i].trim()
                                ? (arr[i] as string)
                                : m.text;
                        cache.set(cacheKey(target, m.text), translated);
                        out[m.index] = translated;
                    });
                }
            } catch {
                // leave missing as English below
            }
        }

        missing.forEach((m) => {
            if (!out[m.index]) out[m.index] = m.text;
        });

        return NextResponse.json({ success: true, translations: out });
    } catch (error) {
        console.error("localize", error);
        return NextResponse.json(
            { success: false, error: "Could not localize" },
            { status: 500 },
        );
    }
}
