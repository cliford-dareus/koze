import { LANGUAGES, languageLabel } from "@/lib/languages";
import type { Lesson, LessonStep } from "@/data/lessons";

/** Language codes offered in the product (en, fr, es, …). */
export const LANG_CODES = LANGUAGES.map((l) => l.value);

export type DirectionCode = string;

export function isDirectionCode(v: unknown): v is DirectionCode {
    if (typeof v !== "string") return false;
    const [src, tgt, extra] = v.split("-");
    if (!src || !tgt || extra) return false;
    if (src === tgt) return false;
    return LANG_CODES.includes(src) && LANG_CODES.includes(tgt);
}

/** Every ordered native→learning pair. Dedicated JSON is optional. */
export const ALL_DIRECTIONS: DirectionCode[] = LANG_CODES.flatMap((src) =>
    LANG_CODES.filter((tgt) => tgt !== src).map((tgt) => `${src}-${tgt}`),
);

export function splitDirection(direction: string): { src: string; tgt: string } | null {
    if (!isDirectionCode(direction)) return null;
    const [src, tgt] = direction.split("-");
    return { src, tgt };
}

export function directionLabelFromCodes(direction: string | null): string {
    if (!direction) return "";
    const parts = splitDirection(direction);
    if (!parts) return direction.toUpperCase();
    return `${languageLabel(parts.src)} → ${languageLabel(parts.tgt)}`;
}

function norm(s: string): string {
    return s
        .toLowerCase()
        .replace(/\([^)]*\)/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** English → other-language glossary built from an en-X pack. */
export function buildEnglishGlossary(pack: Lesson[]): Map<string, string> {
    const map = new Map<string, string>();
    const add = (english?: string, other?: string) => {
        if (!english || !other) return;
        const key = norm(english);
        if (key && !map.has(key)) map.set(key, other);
    };

    for (const lesson of pack) {
        for (const step of lesson.steps) {
            if (step.type === "phrase") {
                for (const p of step.phrases ?? []) add(p.source, p.target);
            } else if (step.type === "vocab") {
                for (const item of step.items ?? []) {
                    add(item.term, item.meaning);
                    add(item.meaning, item.term);
                }
            } else if (step.type === "pair-matching") {
                for (const p of step.pairs ?? []) add(p.native, p.foreign);
            } else if (step.type === "sentence-builder") {
                add(step.targetTranslation, step.targetSentence);
            } else if (step.type === "context-dialogue") {
                add(step.partnerSaysTranslation, step.partnerSays);
            }
        }
    }
    return map;
}

function gloss(map: Map<string, string>, english?: string): string | undefined {
    if (!english) return english;
    return map.get(norm(english)) ?? english;
}

/** Replace English source/gloss side with the native language. Target side stays. */
export function adaptPackToNative(
    targetPack: Lesson[],
    direction: string,
    glossary: Map<string, string>,
    nativeName: string,
): Lesson[] {
    return targetPack.map((lesson) => ({
        ...lesson,
        direction: direction as Lesson["direction"],
        steps: lesson.steps.map((step) => adaptStep(step, glossary, nativeName)),
    }));
}

function adaptStep(step: LessonStep, glossary: Map<string, string>, nativeName: string): LessonStep {
    if (step.type === "phrase") {
        return {
            ...step,
            sourceLabel: nativeName,
            phrases: (step.phrases ?? []).map((p) => ({
                ...p,
                source: gloss(glossary, p.source) ?? p.source,
            })),
        };
    }
    if (step.type === "pair-matching") {
        return {
            ...step,
            pairs: (step.pairs ?? []).map((p) => ({
                ...p,
                native: gloss(glossary, p.native) ?? p.native,
            })),
        };
    }
    if (step.type === "sentence-builder") {
        return {
            ...step,
            targetTranslation: gloss(glossary, step.targetTranslation) ?? step.targetTranslation,
        };
    }
    if (step.type === "context-dialogue") {
        return {
            ...step,
            partnerSaysTranslation:
                gloss(glossary, step.partnerSaysTranslation) ?? step.partnerSaysTranslation,
        };
    }
    if (step.type === "vocab") {
        return {
            ...step,
            items: (step.items ?? []).map((item) => ({
                ...item,
                // term is often the prompt language; meaning is the target
                term: gloss(glossary, item.term) ?? item.term,
            })),
        };
    }
    return step;
}

/** Build an X→en pack by flipping an en-X pack. */
export function reversePack(forward: Lesson[], direction: string): Lesson[] {
    return forward.map((lesson) => ({
        ...lesson,
        direction: direction as Lesson["direction"],
        steps: lesson.steps.map(reverseStep),
    }));
}

function reverseStep(step: LessonStep): LessonStep {
    if (step.type === "phrase") {
        return {
            ...step,
            sourceLabel: step.targetLabel,
            targetLabel: step.sourceLabel,
            phrases: (step.phrases ?? []).map((p) => ({
                ...p,
                source: p.target,
                target: p.source,
            })),
        };
    }
    if (step.type === "pair-matching") {
        return {
            ...step,
            pairs: (step.pairs ?? []).map((p) => ({
                ...p,
                foreign: p.native,
                native: p.foreign,
            })),
        };
    }
    if (step.type === "sentence-builder") {
        const sentence = step.targetTranslation;
        const tokens = sentence.split(/\s+/).filter(Boolean);
        return {
            ...step,
            targetSentence: sentence,
            targetTranslation: step.targetSentence,
            correctTokens: tokens,
            scrambledTokens: [...tokens].reverse(),
        };
    }
    if (step.type === "context-dialogue") {
        return {
            ...step,
            partnerSays: step.partnerSaysTranslation,
            partnerSaysTranslation: step.partnerSays,
        };
    }
    if (step.type === "vocab") {
        return {
            ...step,
            items: (step.items ?? []).map((item) => ({
                ...item,
                term: item.meaning,
                meaning: item.term,
            })),
        };
    }
    return step;
}

/** Instructional fields that should appear in the learner's native language. */
const INSTRUCTION_TYPES = new Set([
    "tip",
    "intro",
    "check",
    "listen",
    "sentence-builder",
    "context-dialogue",
    "pair-matching",
]);

export function collectInstructional(lessons: Lesson[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    const add = (value?: string) => {
        const text = value?.trim();
        if (!text || seen.has(text)) return;
        seen.add(text);
        out.push(text);
    };

    for (const lesson of lessons) {
        for (const step of lesson.steps) {
            if (!INSTRUCTION_TYPES.has(step.type) && step.type !== "tip" && step.type !== "intro") {
                if (typeof (step as { explanation?: string }).explanation === "string") {
                    add((step as { explanation?: string }).explanation);
                }
                continue;
            }
            const s = step as {
                title?: string;
                body?: string;
                bullets?: string[];
                explanation?: string;
                prompt?: string;
            };
            if (step.type === "tip" || step.type === "intro") {
                add(s.title);
                add(s.body);
                s.bullets?.forEach(add);
            }
            add(s.explanation);
            if (step.type !== "tip" && step.type !== "intro") add(s.prompt);
            if (step.type === "check" || step.type === "listen") add(s.title);
        }
    }
    return out;
}

function applyText(map: Map<string, string>, value?: string): string | undefined {
    if (!value) return value;
    return map.get(value) ?? map.get(value.trim()) ?? value;
}

/** Replace tip / intro / explanation / instructional prompt text with native translations. */
export function applyInstructional(lessons: Lesson[], translations: Map<string, string>): Lesson[] {
    if (!translations.size) return lessons;
    return lessons.map((lesson) => ({
        ...lesson,
        steps: lesson.steps.map((step) => applyInstructionStep(step, translations)),
    }));
}

function applyInstructionStep(step: LessonStep, map: Map<string, string>): LessonStep {
    const next = { ...step } as LessonStep & {
        title?: string;
        body?: string;
        bullets?: string[];
        explanation?: string;
        prompt?: string;
    };
    if (typeof next.explanation === "string") {
        next.explanation = applyText(map, next.explanation) ?? next.explanation;
    }
    if (step.type === "tip" || step.type === "intro") {
        if (typeof next.title === "string") next.title = applyText(map, next.title) ?? next.title;
        if (typeof next.body === "string") next.body = applyText(map, next.body) ?? next.body;
        if (Array.isArray(next.bullets)) {
            next.bullets = next.bullets.map((b) => applyText(map, b) ?? b);
        }
        return next;
    }
    if (
        step.type === "check" ||
        step.type === "listen" ||
        step.type === "sentence-builder" ||
        step.type === "context-dialogue" ||
        step.type === "pair-matching"
    ) {
        if (typeof next.prompt === "string") next.prompt = applyText(map, next.prompt) ?? next.prompt;
        if ((step.type === "check" || step.type === "listen") && typeof next.title === "string") {
            next.title = applyText(map, next.title) ?? next.title;
        }
    }
    return next;
}

/**
 * Fetch native-language tips and corrections. No-ops for English or on the server.
 * Batches of 40 keep the Gemini call small; results are cached by the API.
 */
export async function localizeInstructional(
    lessons: Lesson[],
    nativeCode: string,
): Promise<Lesson[]> {
    if (!nativeCode || nativeCode === "en") return lessons;
    if (typeof window === "undefined") return lessons;

    const texts = collectInstructional(lessons);
    if (!texts.length) return lessons;

    const map = new Map<string, string>();
    const batchSize = 40;
    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        try {
            const res = await fetch("/api/localize", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ target: nativeCode, texts: batch }),
            });
            if (!res.ok) continue;
            const data = (await res.json()) as { translations?: string[] };
            batch.forEach((text, idx) => {
                const translated = data.translations?.[idx];
                if (translated) map.set(text, translated);
            });
        } catch {
            // keep English for this batch
        }
    }
    return applyInstructional(lessons, map);
}
