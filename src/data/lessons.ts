import MANIFEST_JSON from "./lessons/manifest.json";

/**
 * Directions that currently have JSON on disk.
 * Additional packs (en-es, es-en, …) are generated via
 * `node scripts/generate-lesson-packs.mjs` and registered below.
 */
export type LessonDirection =
    | "en-fr"
    | "fr-en"
    | "en-es"
    | "es-en"
    | "en-ht"
    | "ht-en"
    | "en-pt"
    | "pt-en"
    | "en-de"
    | "de-en"
    | "en-it"
    | "it-en"
    | "en-zh"
    | "zh-en"
    | "en-jp"
    | "jp-en"
    | "en-ko"
    | "ko-en"
    | "en-ar"
    | "ar-en"
    | "en-hi"
    | "hi-en"
    | null;

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
export const SUPPORTED_DIRECTIONS = MANIFEST_JSON.supportedDirections as Exclude<
    LessonDirection,
    null
>[];

export async function getLessonBySlug(
    slug: string,
    direction: LessonDirection,
): Promise<Lesson | undefined> {
    const path = LESSON_PACKS.find(p => p.direction === direction)?.file;
    if (!path) return undefined;
    const lessons = await import(`${path}`);
    return (lessons.default as Lesson[]).find((l) => l.slug === slug || l.id === slug);
}

export async function getLessonsByDirection(direction: LessonDirection): Promise<Lesson[]> {
    const path = LESSON_PACKS.find(p => p.direction === direction)?.file;
    if (!path) return [];
    const lessons = await import(`${path}`);
    return (lessons.default as Lesson[]);
}

export async function getLessonsByUnit(
    unitId: string,
    direction: LessonDirection,
): Promise<Lesson[]> {
    const path = LESSON_PACKS.find(p => p.direction === direction)?.file;
    if (!path) return [];
    const lessons = await import(`${path}`);
    return (lessons.default as Lesson[]).filter((l) => l.unitId === unitId);
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
    return direction === "en-fr" ? "EN → FR" : "FR → EN";
}
