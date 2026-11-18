import MANIFEST_JSON from "./lessons/manifest.json";
import { languageLabel } from "@/lib/languages";
import {
    adaptPackToNative,
    ALL_DIRECTIONS,
    buildEnglishGlossary,
    directionLabelFromCodes,
    isDirectionCode,
    reversePack,
    splitDirection,
} from "@/data/multi-native";

/**
 * A learning direction is any native→learning pair of known language codes
 * (e.g. "en-fr", "es-fr", "ht-en"). Dedicated JSON packs exist for the
 * English hub; other pairs are synthesized at load time.
 */
export type LessonDirection = string | null;

/** Function / topic tags for review and curriculum filtering. */
export type LessonTag =
    | "greetings"
    | "politeness"
    | "numbers"
    | "time"
    | "food"
    | "cafe"
    | "shopping"
    | "travel"
    | "directions"
    | "transport"
    | "home"
    | "feelings"
    | "questions"
    | "grammar"
    | "social"
    | "work"
    | "basics";

export type BaseType =
    | "vocab"
    | "phrase"
    | "tip"
    | "intro"
    | "check"
    | 'sentence-builder'
    | 'pair-matching'
    | 'listen'
    | 'context-dialogue'
    | 'speak'
    ;


export type BaseLessonStep = {
    type: BaseType;
    prompt: string;
    promptTranslation?: string;
    audioText?: string;
    explanation?: string;
    cultureTip?: string;
}
export interface PairItem {
    id: string;
    foreign: string;
    native: string;
    phonetic?: string;
}

export interface PairMatchingQuestion extends BaseLessonStep {
    type: 'pair-matching';
    pairs: PairItem[];
}

export interface SentenceBuilderQuestion extends BaseLessonStep {
    type: 'sentence-builder';
    targetSentence: string;
    targetTranslation: string;
    scrambledTokens: string[];
    correctTokens: string[];
}

export interface ContextDialogueQuestion extends BaseLessonStep {
    type: 'context-dialogue';
    dialoguePartner: string;
    partnerSays: string;
    partnerSaysPhonetic?: string;
    partnerSaysTranslation: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export type LessonStep =
    | {
        type: "intro";
        title: string;
        body: string;
        explanation?: string;
    }
    | {
        type: "tip";
        title: string;
        body: string;
        bullets?: string[];
        explanation?: string;
    }
    | {
        type: "vocab";
        title: string;
        items: {
            term: string;
            meaning: string;
            note?: string;
            tags?: LessonTag[];
        }[];
        explanation?: string;
    }
    | {
        type: "phrase";
        title: string;
        sourceLabel?: string;
        targetLabel?: string;
        phrases: {
            source: string;
            target: string;
            tags?: LessonTag[];
        }[];
        explanation?: string;
    }
    | {
        type: "check";
        title: string;
        prompt: string;
        options: string[];
        answerIndex: number;
        explanation?: string;
        /** Spaced review from an earlier lesson */
        isReview?: boolean;
        reviewFromLessonId?: string;
        tags?: LessonTag[];
    }
    | {
        /** Spoken production: say the target line aloud */
        type: "speak";
        title: string;
        prompt: string;
        explanation?: string;
        /** Line the learner should produce (target language) */
        targetLine: string;
        /** Optional L1 / support hint */
        hint?: string;
        tags?: LessonTag[];
    }
    | {
        /** Spoken production: say the target line aloud */
        type: "listen";
        title: string;
        prompt: string;
        options: string[];
        answerIndex: number;
        phoneticAnswers?: Record<string, string>;
        explanation?: string;
        /** Line the learner should produce (target language) */
        targetLine: string;
        /** Optional L1 / support hint */
        hint?: string;
        tags?: LessonTag[];
    }
    | PairMatchingQuestion
    | SentenceBuilderQuestion
    | ContextDialogueQuestion;

export type Lesson = {
    id: string;
    slug: string;
    title: string;
    description: string;
    unitId: string;
    direction: LessonDirection;
    level: "beginner" | "elementary" | "intermediate";
    estimatedMinutes: number;
    xp: number;
    steps: LessonStep[];
    /** Optional explicit tags; otherwise inferred from unit / slug */
    tags?: LessonTag[];
};

export type Unit = {
    id: string;
    title: string;
    description: string;
    order: number;
    direction: LessonDirection;
    tags?: LessonTag[];
};

export const UNITS: Unit[] = [
    {
        id: "foundations",
        title: "Foundations",
        description: "Greetings, politeness, numbers — English into French.",
        order: 1,
        direction: "en-fr",
        tags: ["basics", "greetings", "politeness", "numbers"],
    },
    {
        id: "everyday",
        title: "Everyday life",
        description: "Café, food, and small talk in French.",
        order: 2,
        direction: "en-fr",
        tags: ["food", "cafe", "social", "shopping"],
    },
    {
        id: "travel",
        title: "Travel",
        description: "Directions, tickets, and getting around.",
        order: 3,
        direction: "en-fr",
        tags: ["travel", "directions", "transport"],
    },
    {
        id: "grammar-core",
        title: "Grammar core",
        description: "Gender, articles, and present-tense essentials.",
        order: 4,
        direction: "en-fr",
        tags: ["grammar", "basics"],
    },
    {
        id: "fr-en-basics",
        title: "Basics",
        description: "Read French, say it in English — reverse practice.",
        order: 5,
        direction: "fr-en",
        tags: ["basics", "greetings", "politeness"],
    },
    {
        id: "fr-en-daily",
        title: "Daily life",
        description: "Everyday French lines decoded into natural English.",
        order: 6,
        direction: "fr-en",
        tags: ["food", "cafe", "social", "travel"],
    },
];

export type LessonPackManifest = {
    id: string;
    direction: LessonDirection;
    source: string;
    target: string;
    label: string;
    title: string;
    description: string;
    file: string;
    lessonCount: number;
};

export const LESSON_PACKS = MANIFEST_JSON.packs as LessonPackManifest[];
/** All native→learning pairs. JSON on disk is a subset; the rest are synthesized. */
export const SUPPORTED_DIRECTIONS = ALL_DIRECTIONS;

/** Directions that have a dedicated JSON pack on disk. */
export const PACKED_DIRECTIONS = MANIFEST_JSON.supportedDirections as string[];

const PACK_LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
    "en-fr": () => import("./lessons/en-fr.json") as Promise<{ default: unknown }>,
    "en-es": () => import("./lessons/en-es.json") as Promise<{ default: unknown }>,
    "en-ht": () => import("./lessons/en-ht.json") as Promise<{ default: unknown }>,
    "en-pt": () => import("./lessons/en-pt.json") as Promise<{ default: unknown }>,
    "en-de": () => import("./lessons/en-de.json") as Promise<{ default: unknown }>,
    "en-it": () => import("./lessons/en-it.json") as Promise<{ default: unknown }>,
    "en-zh": () => import("./lessons/en-zh.json") as Promise<{ default: unknown }>,
    "en-jp": () => import("./lessons/en-jp.json") as Promise<{ default: unknown }>,
    "en-ko": () => import("./lessons/en-ko.json") as Promise<{ default: unknown }>,
    "en-ar": () => import("./lessons/en-ar.json") as Promise<{ default: unknown }>,
    "en-hi": () => import("./lessons/en-hi.json") as Promise<{ default: unknown }>,
    "fr-en": () => import("./lessons/fr-en.json") as Promise<{ default: unknown }>,
};

async function loadPacked(direction: string): Promise<Lesson[] | null> {
    const loader = PACK_LOADERS[direction];
    if (!loader) return null;
    try {
        const mod = await loader();
        return (mod.default as Lesson[]).map((l) => ({ ...l, direction }) as Lesson);
    } catch {
        return null;
    }
}

/**
 * Resolve lessons for any native→learning pair.
 * 1. Dedicated JSON pack if present
 * 2. en→target pack, with English glosses swapped for the native language
 * 3. Reverse of en→native when the learner is studying English
 */
export async function resolveLessons(direction: LessonDirection): Promise<Lesson[]> {
    if (!direction || !isDirectionCode(direction)) return [];

    const packed = await loadPacked(direction);
    if (packed) return packed;

    const parts = splitDirection(direction);
    if (!parts) return [];
    const { src, tgt } = parts;

    if (tgt === "en") {
        const forward = await loadPacked(`en-${src}`);
        return forward ? reversePack(forward, direction) : [];
    }

    const targetPack = await loadPacked(`en-${tgt}`);
    if (!targetPack) return [];
    if (src === "en") return targetPack;

    const nativePack = await loadPacked(`en-${src}`);
    const glossary = nativePack ? buildEnglishGlossary(nativePack) : new Map();
    return adaptPackToNative(targetPack, direction, glossary, languageLabel(src));
}

export async function getLessonBySlug(
    slug: string,
    direction: LessonDirection,
): Promise<Lesson | undefined> {
    const lessons = await resolveLessons(direction);
    return lessons.find((l) => l.slug === slug || l.id === slug);
}

export async function getLessonsByDirection(direction: LessonDirection): Promise<Lesson[]> {
    return resolveLessons(direction);
}

export async function getLessonsByUnit(
    unitId: string,
    direction: LessonDirection,
): Promise<Lesson[]> {
    const lessons = await resolveLessons(direction);
    return lessons.filter((l) => l.unitId === unitId);
}

export async function getUnit(unitId: string): Promise<Unit | undefined> {
    return UNITS.find((u) => u.id === unitId);
}

export async function getNextLesson(
    currentId: string,
    direction: LessonDirection,
): Promise<Lesson | undefined> {
    const lessons = await getLessonsByDirection(direction);
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx < 0 || idx >= lessons.length - 1) return undefined;
    return lessons[idx + 1];
}

export async function getPreviousLesson(
    currentId: string,
    direction: LessonDirection,
): Promise<Lesson | undefined> {
    const lessons = await getLessonsByDirection(direction);
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx <= 0) return undefined;
    return lessons[idx - 1];
}

export function directionLabel(direction: LessonDirection): string {
    if (!direction) return "";
    const pack = LESSON_PACKS.find((p) => p.direction === direction);
    if (pack?.label && isDirectionCode(direction) && direction.startsWith("en-")) {
        return pack.label;
    }
    return directionLabelFromCodes(direction);
}
