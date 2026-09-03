import EN_FR from './en-fr.json';
import FR_EN from './fr-en.json';

export type LessonDirection = "en-fr" | "fr-en";

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
        items: { term: string; meaning: string; note?: string }[];
    }
    | {
        type: "phrase";
        title: string;
        sourceLabel?: string;
        targetLabel?: string;
        phrases: { source: string; target: string }[];
    }
    | {
        type: "check";
        title: string;
        prompt: string;
        options: string[];
        answerIndex: number;
        explanation?: string;
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
};

const LESSONS_PATH_MAP = {
    "en-fr": EN_FR,
    "fr-en": FR_EN
};

export type Unit = {
    id: string;
    title: string;
    description: string;
    order: number;
    direction: LessonDirection;
};

export const UNITS: Unit[] = [
    {
        id: "foundations",
        title: "Foundations (EN → FR)",
        description: "Greetings, politeness, numbers — English into French.",
        order: 1,
        direction: "en-fr",
    },
    {
        id: "everyday",
        title: "Everyday life (EN → FR)",
        description: "Café, food, and small talk in French.",
        order: 2,
        direction: "en-fr",
    },
    {
        id: "travel",
        title: "Travel (EN → FR)",
        description: "Directions, tickets, and getting around.",
        order: 3,
        direction: "en-fr",
    },
    {
        id: "grammar-core",
        title: "Grammar core (EN → FR)",
        description: "Gender, articles, and present-tense essentials.",
        order: 4,
        direction: "en-fr",
    },
    {
        id: "fr-en-basics",
        title: "Basics (FR → EN)",
        description: "Read French, say it in English — reverse practice.",
        order: 5,
        direction: "fr-en",
    },
    {
        id: "fr-en-daily",
        title: "Daily French → English",
        description: "Everyday French lines decoded into natural English.",
        order: 6,
        direction: "fr-en",
    },
];

function dirLabels(direction: LessonDirection) {
    return direction === "en-fr"
        ? { sourceLabel: "English", targetLabel: "Français" }
        : { sourceLabel: "Français", targetLabel: "English" };
}

export function getLessonBySlug(slug: string, direction: LessonDirection): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    return lessons.find((l) => l.slug === slug || l.id === slug) as Lesson | undefined;
}

export function getLessonsByDirection(direction: LessonDirection): Lesson[] {
    const lessons = LESSONS_PATH_MAP[direction];  
    return lessons as Lesson[];
}

export async function getLessonsByUnit(unitId: string, direction: LessonDirection): Promise<Lesson[]> {
    const lessons = LESSONS_PATH_MAP[direction];
    return lessons.filter((l) => l.unitId === unitId) as Lesson[];
}

export function getUnit(unitId: string): Unit | undefined {
    return UNITS.find((u) => u.id === unitId);
}

export function getNextLesson(currentId: string, direction: LessonDirection): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx < 0 || idx >= lessons.length - 1) return undefined;
    return lessons[idx + 1] as Lesson;
}

export function getPreviousLesson(currentId: string, direction: LessonDirection): Lesson | undefined {
    const lessons = LESSONS_PATH_MAP[direction];
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx <= 0) return undefined;
    return lessons[idx - 1] as Lesson;
}

export function directionLabel(direction: LessonDirection): string {
    return direction === "en-fr" ? "EN → FR" : "FR → EN";
}
