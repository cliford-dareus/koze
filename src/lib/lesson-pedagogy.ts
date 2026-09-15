import {
    getLessonsByDirection,
    getUnit,
    type Lesson,
    type LessonDirection,
    type LessonStep,
    type LessonTag,
} from "@/data/lessons";

/** Target share of check steps that should be spaced review (20–30%). */
export const REVIEW_CHECK_RATIO = 0.25;

const SLUG_TAG_HINTS: { match: RegExp; tags: LessonTag[] }[] = [
    { match: /greet|hello|salut/i, tags: ["greetings"] },
    { match: /please|thank|merci|polite/i, tags: ["politeness"] },
    { match: /number|count|chiffre/i, tags: ["numbers"] },
    { match: /time|clock|heure/i, tags: ["time"] },
    { match: /food|eat|meal|restaurant/i, tags: ["food"] },
    { match: /cafe|coffee|café/i, tags: ["cafe", "food"] },
    { match: /shop|market|buy/i, tags: ["shopping"] },
    { match: /travel|ticket|train|hotel/i, tags: ["travel"] },
    { match: /direction|where|map/i, tags: ["directions", "travel"] },
    { match: /transport|bus|metro/i, tags: ["transport", "travel"] },
    { match: /home|house|room/i, tags: ["home"] },
    { match: /feel|emotion|mood/i, tags: ["feelings"] },
    { match: /question|ask|what|who/i, tags: ["questions"] },
    { match: /grammar|article|gender|tense|verb/i, tags: ["grammar"] },
    { match: /social|talk|friend/i, tags: ["social"] },
];

/** Resolve lesson tags (explicit → unit → slug heuristics). */
export function resolveLessonTags(lesson: Lesson): LessonTag[] {
    if (lesson.tags?.length) return Array.from(new Set(lesson.tags));

    const tags = new Set<LessonTag>();
    const unit = getUnit(lesson.unitId);
    unit?.tags?.forEach((t) => tags.add(t));

    const haystack = `${lesson.slug} ${lesson.id} ${lesson.title}`;
    for (const { match, tags: hinted } of SLUG_TAG_HINTS) {
        if (match.test(haystack)) hinted.forEach((t) => tags.add(t));
    }

    if (!tags.size) tags.add("basics");
    return Array.from(tags);
}

type CheckStep = Extract<LessonStep, { type: "check" }>;
type SpeakStep = Extract<LessonStep, { type: "speak" }>;
type PhraseStep = Extract<LessonStep, { type: "phrase" }>;

function isCheck(step: LessonStep): step is CheckStep {
    return step.type === "check";
}

function isPhrase(step: LessonStep): step is PhraseStep {
    return step.type === "phrase";
}

function isSpeak(step: LessonStep): step is SpeakStep {
    return step.type === "speak";
}

function shuffleInPlace<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
}

/** Stable-ish pick so the same lesson doesn't reshuffle every keystroke mid-session. */
function seededShuffle<T>(items: T[], seed: string): T[] {
    const arr = [...items];
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    for (let i = arr.length - 1; i > 0; i--) {
        h = (h * 1103515245 + 12345) | 0;
        const j = Math.abs(h) % (i + 1);
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
}

/** All check steps from earlier catalog lessons the user has completed. */
export function collectReviewChecks(
    direction: LessonDirection,
    currentLessonId: string,
    completedLessonIds: string[],
): CheckStep[] {
    const catalog = getLessonsByDirection(direction);
    const currentIdx = catalog.findIndex((l) => l.id === currentLessonId);
    const completed = new Set(completedLessonIds);
    const pool: CheckStep[] = [];

    catalog.forEach((lesson, idx) => {
        if (lesson.id === currentLessonId) return;
        // Prefer earlier lessons; also allow any completed lesson
        const earlier = currentIdx < 0 || idx < currentIdx;
        if (!earlier && !completed.has(lesson.id)) return;
        if (!completed.has(lesson.id) && !earlier) return;
        // Only inject from completed lessons so we don't quiz unknown material
        if (!completed.has(lesson.id)) return;

        for (const step of lesson.steps) {
            if (!isCheck(step) || step.isReview) continue;
            pool.push({
                ...step,
                title: step.title.startsWith("Review")
                    ? step.title
                    : `Review · ${step.title.replace(/^Check\s*·\s*/i, "")}`,
                isReview: true,
                reviewFromLessonId: lesson.id,
                tags: step.tags ?? resolveLessonTags(lesson),
            });
        }
    });

    return pool;
}

/**
 * How many review checks to add so reviews are ~REVIEW_CHECK_RATIO of all checks.
 * nativeChecks + review = total; review ≈ ratio * total → review ≈ ratio/(1-ratio) * native
 */
export function reviewCountFor(nativeCheckCount: number): number {
    if (nativeCheckCount <= 0) return 0;
    const ratio = REVIEW_CHECK_RATIO;
    const n = Math.round((ratio / (1 - ratio)) * nativeCheckCount);
    return Math.max(1, Math.min(n, Math.max(1, nativeCheckCount)));
}

/** Build a speak step from the first phrase in the lesson (target language line). */
export function buildSpeakStep(lesson: Lesson): SpeakStep | null {
    const phraseStep = lesson.steps.find(isPhrase);
    const first = phraseStep?.phrases?.[0];
    if (!first?.target) return null;

    const tags = resolveLessonTags(lesson);
    const learningFr = lesson.direction === "en-fr";

    return {
        type: "speak",
        title: learningFr ? "Say it aloud" : "Say the English",
        prompt: learningFr
            ? "Read the French line out loud. Use the mic visualizer if you like."
            : "Say this line in English out loud.",
        targetLine: first.target,
        hint: first.source,
        tags,
    };
}

export type EnhanceOptions = {
    completedLessonIds?: string[];
    /** Inject speak step from first phrase (default true). */
    includeSpeak?: boolean;
    /** Inject spaced review checks (default true). */
    includeReview?: boolean;
};

/**
 * Runtime lesson enhancement:
 * - tags on the lesson object
 * - optional speak production step before checks
 * - 20–30% review checks drawn from completed earlier lessons
 */
export function enhanceLesson(
    lesson: Lesson,
    options: EnhanceOptions = {},
): Lesson {
    const {
        completedLessonIds = [],
        includeSpeak = true,
        includeReview = true,
    } = options;

    const tags = resolveLessonTags(lesson);
    const steps = [...lesson.steps];

    // Speak: insert once before the first check (or at end if no checks)
    if (includeSpeak && !steps.some(isSpeak)) {
        const speak = buildSpeakStep(lesson);
        if (speak) {
            const firstCheckIdx = steps.findIndex(isCheck);
            if (firstCheckIdx >= 0) {
                steps.splice(firstCheckIdx, 0, speak);
            } else {
                steps.push(speak);
            }
        }
    }

    // Review checks
    if (includeReview) {
        const nativeChecks = steps.filter(isCheck).filter((c) => !c.isReview);
        const need = reviewCountFor(nativeChecks.length);
        if (need > 0 && completedLessonIds.length > 0) {
            const pool = collectReviewChecks(
                lesson.direction,
                lesson.id,
                completedLessonIds,
            );
            // Prefer shared tags
            const tagged = pool.filter((c) =>
                (c.tags || []).some((t) => tags.includes(t)),
            );
            const preferred = tagged.length ? tagged : pool;
            const picks = seededShuffle(
                preferred,
                `${lesson.id}:${completedLessonIds.join(",")}`,
            ).slice(0, need);

            if (picks.length) {
                // Remove existing non-review checks, interleave reviews ~every 2–3
                const withoutChecks = steps.filter((s) => !isCheck(s));
                const interleaved: LessonStep[] = [];
                const native = [...nativeChecks];
                const reviews = shuffleInPlace([...picks]);
                let ri = 0;
                native.forEach((c, i) => {
                    interleaved.push(c);
                    // Insert a review after every 2nd native check when available
                    if ((i + 1) % 2 === 0 && ri < reviews.length) {
                        interleaved.push(reviews[ri++]!);
                    }
                });
                while (ri < reviews.length) {
                    interleaved.push(reviews[ri++]!);
                }

                // Rebuild: non-check steps in order, then replace check region
                // Keep structure: everything before first original check, then interleaved checks, then trailing non-checks after last check
                const firstCheck = lesson.steps.findIndex(isCheck);
                const lastCheck = (() => {
                    let idx = -1;
                    lesson.steps.forEach((s, i) => {
                        if (isCheck(s)) idx = i;
                    });
                    return idx;
                })();

                if (firstCheck >= 0) {
                    const head = steps
                        .slice(0, firstCheck)
                        .filter((s) => !isCheck(s));
                    // steps may already include speak inserted before first check
                    const speakSteps = head.filter(isSpeak);
                    const headNoSpeak = head.filter((s) => !isSpeak(s));
                    const tail = steps
                        .slice(lastCheck + 1)
                        .filter((s) => !isCheck(s) && !isSpeak(s));

                    const rebuilt = [
                        ...headNoSpeak,
                        ...speakSteps,
                        ...interleaved,
                        ...tail,
                    ];
                    return {
                        ...lesson,
                        tags,
                        steps: rebuilt,
                    };
                }

                return {
                    ...lesson,
                    tags,
                    steps: [...withoutChecks, ...interleaved],
                };
            }
        }
    }

    return { ...lesson, tags, steps };
}

export function tagLabel(tag: LessonTag): string {
    return tag.replace(/-/g, " ");
}
