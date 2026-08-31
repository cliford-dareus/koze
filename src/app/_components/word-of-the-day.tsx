"use client";

import { PROGRESS_KEY } from "@/lib/progress";
import { useEffect, useState } from "react";
import { getDefinition } from "../_actions/translate";

const WORD = {
    word: "douceur",
    lang: "FR",
    meaning: "gentleness, sweetness",
    example: "Parle avec douceur.",
};

export default function WordOfTheDay({ word }: { word: { ok: boolean; text?: string | undefined; error?: string | undefined; } }) {
    const [currentWord, setCurrentWord] = useState("");
    const [definition, setDefinition] = useState({});

    useEffect(() => {
        const refresh = async () => {
            if (typeof window === "undefined") return
            const raw = localStorage.getItem(PROGRESS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            setCurrentWord(parsed.currentWord);
        };

        if (!word.ok) {
            refresh();
        }
        window.addEventListener("storage", refresh);
        window.addEventListener("koze-progress", refresh);
        return () => {
            window.removeEventListener("storage", refresh);
            window.removeEventListener("koze-progress", refresh);
        };
    }, [word]);
    
    useEffect(() => {
        const fetchDefinition = async () => {
            const definition = await getDefinition(currentWord);
            console.log(definition);
            setDefinition(definition);
        };
        if (!currentWord) return;
        fetchDefinition();
    }, [currentWord]);

    return (
        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Word of the day
            </p>
            <p className="mt-3 font-display text-3xl font-medium">{currentWord}</p>
            <p className="mt-1 text-sm text-muted-foreground">
                {WORD.lang} · {WORD.meaning}
            </p>
            <p className="mt-4 border-t border-border pt-4 text-sm italic">
                {WORD.example}
            </p>
        </div>
    );
}
