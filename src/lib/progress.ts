export type ProgressState = {
    translations: number;
    listeningCorrect: number;
    readingSessions: number;
    quizCorrect: number;
    streak: number;
    lastActiveDate: string | null;
    lastTopic: string | null;
};

export const PROGRESS_KEY = "koze-progress-v1";

export const defaultProgress = (): ProgressState => ({
    translations: 0,
    listeningCorrect: 0,
    readingSessions: 0,
    quizCorrect: 0,
    streak: 0,
    lastActiveDate: null,
    lastTopic: null,
});

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function loadProgress(): ProgressState {
    if (typeof window === "undefined") return defaultProgress();
    try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (!raw) return defaultProgress();
        return { ...defaultProgress(), ...JSON.parse(raw) } as ProgressState;
    } catch {
        return defaultProgress();
    }
}

export function saveProgress(state: ProgressState) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent("koze-progress"));
    } catch {
        // quota / private mode — ignore
    }
}

function bumpStreak(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.lastActiveDate === today) return state;
    if (state.lastActiveDate === yesterdayKey()) {
        return { ...state, streak: state.streak + 1, lastActiveDate: today };
    }
    return { ...state, streak: 1, lastActiveDate: today };
}

export function recordActivity(
    kind: "translation" | "listening" | "reading" | "quiz",
    extra?: { topic?: string },
) {
    const prev = loadProgress();
    let next = bumpStreak(prev);

    if (kind === "translation") next = { ...next, translations: next.translations + 1 };
    if (kind === "listening")
        next = { ...next, listeningCorrect: next.listeningCorrect + 1 };
    if (kind === "reading")
        next = { ...next, readingSessions: next.readingSessions + 1 };
    if (kind === "quiz") next = { ...next, quizCorrect: next.quizCorrect + 1 };
    if (extra?.topic) next = { ...next, lastTopic: extra.topic };

    saveProgress(next);
    return next;
}

export function totalActivities(p: ProgressState) {
    return p.translations + p.listeningCorrect + p.readingSessions + p.quizCorrect;
}
