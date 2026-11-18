/** Short correction / praise lines shown when a step has no explanation. */

const LINES: Record<string, { correct: string; review: string; target: string }> = {
    en: {
        correct: "Wonderful clarity and focus.",
        review: "Take a gentle breath. We will revisit this phrase shortly.",
        target: "Target phrasing",
    },
    fr: {
        correct: "Belle clarté, belle attention.",
        review: "Respire doucement. Nous reviendrons sur cette phrase.",
        target: "Formulation attendue",
    },
    es: {
        correct: "Qué claridad y qué calma.",
        review: "Respira suave. Volveremos a esta frase en un momento.",
        target: "Frase esperada",
    },
    ht: {
        correct: "Bèl klète, bèl atansyon.",
        review: "Pran yon ti souf. N ap retounen sou fraz sa a.",
        target: "Fraz ki te dwe a",
    },
    pt: {
        correct: "Que clareza e que calma.",
        review: "Respira devagar. Voltamos a esta frase já já.",
        target: "Frase esperada",
    },
    de: {
        correct: "Wunderschön klar und ruhig.",
        review: "Atme einmal tief. Wir kommen gleich auf diesen Satz zurück.",
        target: "Zielsatz",
    },
    it: {
        correct: "Che chiarezza, che calma.",
        review: "Fai un respiro lento. Torneremo su questa frase.",
        target: "Frase attesa",
    },
    zh: {
        correct: "很清楚，也很专注。",
        review: "轻轻呼吸。我们稍后再看这句。",
        target: "目标说法",
    },
    jp: {
        correct: "とても明瞭で、落ち着いています。",
        review: "一度深呼吸を。このフレーズはすぐ戻ります。",
        target: "目標の言い方",
    },
    ko: {
        correct: "맑고 차분합니다.",
        review: "숨을 고르세요. 이 문장은 곧 다시 봅니다.",
        target: "목표 표현",
    },
    ar: {
        correct: "وضوح جميل وهدوء.",
        review: "خذ نفسًا هادئًا. سنعود إلى هذه العبارة قريبًا.",
        target: "الصياغة المطلوبة",
    },
    hi: {
        correct: "कितनी स्पष्टता, कितना सुकून।",
        review: "एक धीमी साँस लें। इस वाक्य पर हम जल्द लौटेंगे।",
        target: "लक्षित वाक्य",
    },
};

export function nativeFeedback(
    code: string | null | undefined,
    kind: "correct" | "review" | "target",
): string {
    const row = LINES[code || "en"] ?? LINES.en;
    return row[kind];
}
