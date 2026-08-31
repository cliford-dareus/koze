import type { ProgressState } from "@/lib/progress";
import { defaultProgress } from "@/lib/progress";

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function bumpStreak(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.lastActiveDate === today) return state;
    if (state.lastActiveDate === yesterdayKey()) {
        return { ...state, streak: state.streak + 1, lastActiveDate: today };
    }
    return { ...state, streak: 1, lastActiveDate: today };
}

export function applyActivity(
    prev: ProgressState,
    kind: "translation" | "listening" | "reading" | "quiz",
    extra?: { topic?: string },
): ProgressState {
    let next = bumpStreak({ ...defaultProgress(), ...prev });

    if (kind === "translation") next = { ...next, translations: next.translations + 1 };
    if (kind === "listening")
        next = { ...next, listeningCorrect: next.listeningCorrect + 1 };
    if (kind === "reading") next = { ...next, readingSessions: next.readingSessions + 1 };
    if (kind === "quiz") next = { ...next, quizCorrect: next.quizCorrect + 1 };
    if (extra?.topic) next = { ...next, lastTopic: extra.topic };

    return next;
}

/** Merge local guest progress into cloud progress (max per counter, keep better streak). */
export function mergeProgress(local: ProgressState, cloud: ProgressState): ProgressState {
    const a = { ...defaultProgress(), ...local };
    const b = { ...defaultProgress(), ...cloud };

    return {
        translations: Math.max(a.translations, b.translations),
        listeningCorrect: Math.max(a.listeningCorrect, b.listeningCorrect),
        readingSessions: Math.max(a.readingSessions, b.readingSessions),
        quizCorrect: Math.max(a.quizCorrect, b.quizCorrect),
        streak: Math.max(a.streak, b.streak),
        currentWord: a.currentWord || b.currentWord,
        currentWordDate: a.currentWordDate || b.currentWordDate,
        lastActiveDate:
            (a.lastActiveDate || "") > (b.lastActiveDate || "")
                ? a.lastActiveDate
                : b.lastActiveDate,
        lastTopic: a.lastTopic || b.lastTopic,
    };
}
