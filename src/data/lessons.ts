import EN_FR from "./en-fr.json";
import FR_EN from "./fr-en.json";

export type LessonDirection = "en-fr" | "fr-en";

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

export type LessonStep =
    | {
          type: "intro";
          title: string;
          body: string;
      }
    | {
          type: "tip";
          title: string;
          body: string;
          bullets?: string[];
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
          /** Line the learner should produce (target language) */
          targetLine: string;
          /** Optional L1 / support hint */
          hint?: string;
          tags?: LessonTag[];
      };

export type Lesson = {
    id: string;
    slug: string;
    title: string;
    description: string;
    unitId: string;
    direction: LessonDirection;
    level: "beginner" | "elementary" | "intermediate";
    estimatedMinutes: number;
    steps: LessonStep[];
    /** Optional explicit tags; otherwise inferred from unit / slug */
    tags?: LessonTag[];
};

export const LESSONS_PATH_MAP = {
    "en-fr": EN_FR as Lesson[],
    "fr-en": FR_EN as Lesson[],
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
        title: "Foundations (EN → FR)",
        description: "Greetings, politeness, numbers — English into French.",
        order: 1,
        direction: "en-fr",
        tags: ["basics", "greetings", "politeness", "numbers"],
    },
    {
        id: "everyday",
        title: "Everyday life (EN → FR)",
        description: "Café, food, and small talk in French.",
        order: 2,
        direction: "en-fr",
        tags: ["food", "cafe", "social", "shopping"],
    },
    {
        id: "travel",
        title: "Travel (EN → FR)",
        description: "Directions, tickets, and getting around.",
        order: 3,
        direction: "en-fr",
        tags: ["travel", "directions", "transport"],
    },
    {
        id: "grammar-core",
        title: "Grammar core (EN → FR)",
        description: "Gender, articles, and present-tense essentials.",
        order: 4,
        direction: "en-fr",
        tags: ["grammar", "basics"],
    },
    {
        id: "fr-en-basics",
        title: "Basics (FR → EN)",
        description: "Read French, say it in English — reverse practice.",
        order: 5,
        direction: "fr-en",
        tags: ["basics", "greetings", "politeness"],
    },
    {
        id: "fr-en-daily",
        title: "Daily French → English",
        description: "Everyday French lines decoded into natural English.",
        order: 6,
        direction: "fr-en",
        tags: ["food", "cafe", "social", "travel"],
    },
];

export function getLessonBySlug(
    slug: string,
    direction: LessonDirection,
): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    return lessons.find((l) => l.slug === slug || l.id === slug);
}

export function getLessonsByDirection(direction: LessonDirection): Lesson[] {
    return LESSONS_PATH_MAP[direction];
}

export async function getLessonsByUnit(
    unitId: string,
    direction: LessonDirection,
): Promise<Lesson[]> {
    return LESSONS_PATH_MAP[direction].filter((l) => l.unitId === unitId);
}

export function getUnit(unitId: string): Unit | undefined {
    return UNITS.find((u) => u.id === unitId);
}

export function getNextLesson(
    currentId: string,
    direction: LessonDirection,
): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx < 0 || idx >= lessons.length - 1) return undefined;
    return lessons[idx + 1];
}

export function getPreviousLesson(
    currentId: string,
    direction: LessonDirection,
): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx <= 0) return undefined;
    return lessons[idx - 1];
}

export function directionLabel(direction: LessonDirection): string {
    return direction === "en-fr" ? "EN → FR" : "FR → EN";
}
