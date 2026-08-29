export type QuizItem = {
    question: string;
    choices: string[];
    correctIndex: number;
    imageUrl: string;
    explanation: string;
};

export type QuizHistoryItem = QuizItem & {
    chosenIndex: number | null;
};

export type QuizRequest = {
    category: string;
    history?: QuizHistoryItem[];
};

export type QuizResponse =
    | { success: true; quiz: QuizItem }
    | { success: false; error: string };

export function isValidQuiz(value: unknown): value is QuizItem {
    if (!value || typeof value !== "object") return false;
    const v = value as Record<string, unknown>;
    if (typeof v.question !== "string" || !v.question.trim()) return false;
    if (!Array.isArray(v.choices) || v.choices.length !== 4) return false;
    if (!v.choices.every((c) => typeof c === "string" && c.trim().length > 0))
        return false;
    const unique = new Set(v.choices.map((c) => String(c).trim().toLowerCase()));
    if (unique.size !== 4) return false;
    if (
        typeof v.correctIndex !== "number" ||
        !Number.isInteger(v.correctIndex) ||
        v.correctIndex < 0 ||
        v.correctIndex > 3
    ) {
        return false;
    }
    return true;
}

export function normalizeQuiz(raw: unknown): QuizItem | null {
    if (!raw || typeof raw !== "object") return null;
    const v = raw as Record<string, unknown>;

    const question =
        typeof v.question === "string"
            ? v.question
            : typeof v.Question === "string"
                ? v.Question
                : "";

    let choices: string[] = [];
    if (Array.isArray(v.choices)) {
        choices = v.choices.map((c) => String(c).trim());
    } else if (Array.isArray(v.wrong_answer) && v.correct_answer != null) {
        choices = [
            String(v.correct_answer),
            ...v.wrong_answer.map((c) => String(c)),
        ].map((c) => c.trim());
    }

    let correctIndex =
        typeof v.correctIndex === "number"
            ? v.correctIndex
            : typeof v.correct_index === "number"
                ? v.correct_index
                : 0;

    if (v.correct_answer != null && Array.isArray(v.choices)) {
        const idx = choices.findIndex(
            (c) => c.toLowerCase() === String(v.correct_answer).trim().toLowerCase(),
        );
        if (idx >= 0) correctIndex = idx;
    }

    const imageUrl =
        typeof v.imageUrl === "string"
            ? v.imageUrl
            : typeof v.image === "string"
                ? v.image
                : "";

    const explanation =
        typeof v.explanation === "string" ? v.explanation.trim() : "";

    const quiz: QuizItem = {
        question: question.trim(),
        choices: choices.slice(0, 4),
        correctIndex,
        imageUrl: imageUrl.trim(),
        explanation,
    };

    return isValidQuiz(quiz) ? quiz : null;
}

export function parseQuizJson(raw: string): QuizItem | null {
    const trimmed = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/i, "")
        .trim();
    try {
        return normalizeQuiz(JSON.parse(trimmed));
    } catch {
        return null;
    }
}

export function shuffleQuizChoices(item: QuizItem): QuizItem {
    const indexed = item.choices.map((text, i) => ({ text, i }));
    for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    return {
        ...item,
        choices: indexed.map((x) => x.text),
        correctIndex: indexed.findIndex((x) => x.i === item.correctIndex),
    };
}
