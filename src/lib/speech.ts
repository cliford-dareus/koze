"use client";

function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        const handler = () => {
            resolve(window.speechSynthesis.getVoices());
            window.speechSynthesis.removeEventListener("voiceschanged", handler);
        };
        window.speechSynthesis.addEventListener("voiceschanged", handler);
    });
}

export async function speak(text: string, lang = "en-US") {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text.trim()) return;
    window.speechSynthesis.cancel();

    const voices = await getVoicesAsync();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;

    const match =
        voices.find((v) => v.lang === lang) ??
        voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (match) u.voice = match;

    // slight delay works around a Chromium cancel/speak race condition
    setTimeout(() => window.speechSynthesis.speak(u), 50);
}

export function stopSpeaking() {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
}

type Recog = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

export function startListening(
    lang: string,
    onText: (text: string) => void,
    onEnd: () => void,
): (() => void) | null {
    const Ctor =
        (window as unknown as { webkitSpeechRecognition?: new () => Recog })
            .webkitSpeechRecognition ??
        (window as unknown as { SpeechRecognition?: new () => Recog }).SpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (ev) => {
        const t = ev.results[0]?.[0]?.transcript;
        if (t) onText(t);
    };
    rec.onerror = onEnd;
    rec.onend = onEnd;
    rec.start();
    return () => rec.stop();
}
