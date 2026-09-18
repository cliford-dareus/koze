import UNITS_JSON from "./lessons/units.json";
import MANIFEST_JSON from "./lessons/manifest.json";
import EN_FR from "./en-fr.json";
import FR_EN from "./fr-en.json";

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
    | "en-ja"
    | "ja-en"
    | "en-ko"
    | "ko-en"
    | "en-ar"
    | "ar-en"
    | "en-hi"
    | "hi-en"
    | null;

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
    | "sentence-builder"
    | "pair-matching"
    | "listen"
    | "context-dialogue"
    | "speak";

export type BaseLessonStep = {
    type: BaseType;
    prompt: string;
    promptTranslation?: string;
    audioText?: string;
    explanation?: string;
    cultureTip?: string;
};

export interface PairItem {
    id: string;
    foreign: string;
    native: string;
    phonetic?: string;
}

export interface PairMatchingQuestion extends BaseLessonStep {
    type: "pair-matching";
    pairs: PairItem[];
}

export interface SentenceBuilderQuestion extends BaseLessonStep {
    type: "sentence-builder";
    targetSentence: string;
    targetTranslation: string;
    scrambledTokens: string[];
    correctTokens: string[];
}

export interface ContextDialogueQuestion extends BaseLessonStep {
    type: "context-dialogue";
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
    | { type: "intro"; title: string; body: string; explanation?: string }
    | { type: "tip"; title: string; body: string; bullets?: string[]; explanation?: string }
    | {
          type: "vocab";
          title: string;
          items: { term: string; meaning: string; note?: string; tags?: LessonTag[] }[];
          explanation?: string;
      }
    | {
          type: "phrase";
          title: string;
          sourceLabel?: string;
          targetLabel?: string;
          phrases: { source: string; target: string; tags?: LessonTag[] }[];
          explanation?: string;
      }
    | {
          type: "check";
          title: string;
          prompt: string;
          options: string[];
          answerIndex: number;
          explanation?: string;
          isReview?: boolean;
          reviewFromLessonId?: string;
          tags?: LessonTag[];
      }
    | {
          type: "speak";
          title: string;
          prompt: string;
          explanation?: string;
          targetLine: string;
          hint?: string;
          tags?: LessonTag[];
      }
    | {
          type: "listen";
          title: string;
          prompt: string;
          options: string[];
          answerIndex: number;
          phoneticAnswers?: Record<string, string>;
          explanation?: string;
          targetLine?: string;
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
    level: string;
    estimatedMinutes: number;
    xp?: number;
    steps: LessonStep[];
};

export type Unit = {
    id: string;
    title: string;
    description: string;
    order: number;
    tags?: LessonTag[];
};

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

export const UNITS: Unit[] = UNITS_JSON as Unit[];

export const LESSON_PACKS = MANIFEST_JSON.packs as LessonPackManifest[];
export const SUPPORTED_DIRECTIONS = MANIFEST_JSON.supportedDirections as Exclude<
    LessonDirection,
    null
>[];

/**
 * Only packs that are committed under src/data/*.json are listed here.
 * After running `node scripts/generate-lesson-packs.mjs`, extend this map
 * (and the static imports above) for each new file.
 */
export const LESSONS_PATH_MAP: Partial<
    Record<Exclude<LessonDirection, null>, Lesson[]>
> = {
    "en-fr": EN_FR as Lesson[],
    "fr-en": FR_EN as Lesson[],
};

export function getLessonBySlug(
    slug: string,
    direction: LessonDirection,
): Lesson | undefined {
    if (!direction) return undefined;
    const lessons = LESSONS_PATH_MAP[direction];
    return lessons?.find((l) => l.slug === slug || l.id === slug);
}

export function getLessonsByDirection(direction: LessonDirection): Lesson[] {
    if (!direction) return [];
    return LESSONS_PATH_MAP[direction] ?? [];
}

export async function getLessonsByUnit(
    unitId: string,
    direction: LessonDirection,
): Promise<Lesson[]> {
    return getLessonsByDirection(direction).filter((l) => l.unitId === unitId);
}

export function getUnit(unitId: string): Unit | undefined {
    return UNITS.find((u) => u.id === unitId);
}

export function getUnitsForDirection(direction: LessonDirection): Unit[] {
    if (!direction) return [];
    const used = new Set(getLessonsByDirection(direction).map((l) => l.unitId));
    return UNITS.filter((u) => used.has(u.id)).sort((a, b) => a.order - b.order);
}

export function getNextLesson(
    currentId: string,
    direction: LessonDirection,
): Lesson | undefined {
    const lessons = getLessonsByDirection(direction);
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx < 0 || idx >= lessons.length - 1) return undefined;
    return lessons[idx + 1];
}

export function getPreviousLesson(
    currentId: string,
    direction: LessonDirection,
): Lesson | undefined {
    const lessons = getLessonsByDirection(direction);
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx <= 0) return undefined;
    return lessons[idx - 1];
}

export function directionLabel(direction: LessonDirection): string {
    if (!direction) return "";
    const pack = LESSON_PACKS.find((p) => p.direction === direction);
    return pack?.label ?? direction.toUpperCase();
}

export function isSupportedDirection(
    direction: string | null | undefined,
): direction is Exclude<LessonDirection, null> {
    if (!direction) return false;
    return direction in LESSONS_PATH_MAP;
}
