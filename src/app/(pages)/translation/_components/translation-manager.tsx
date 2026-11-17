"use client";

import { FormEvent, useMemo, useState } from "react";
import ResultComponent from "./result-component";
import TranslationForm from "./translation-form";
import { translate } from "@/app/_actions/translate";
import { LANGUAGES } from "@/lib/languages";
import { recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeftRight, Languages } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import type { CairnMood } from "@/app/_components/cairn-mascot";
import { sound } from "@/lib/sound";

const TranslationManager = () => {
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [textToTranslate, setTextToTranslate] = useState("");
    const [selectedLang, setSelectedLang] = useState({
        from: "en",
        to: "fr",
    });

    const fromLang = LANGUAGES.find((l) => l.value === selectedLang.from);
    const toLang = LANGUAGES.find((l) => l.value === selectedLang.to);

    const cairnMood: CairnMood | undefined = useMemo(() => {
        if (isLoading) return "thinking";
        if (error) return "puzzled";
        return undefined;
    }, [isLoading, error]);

    const handleLangChange = (type: "from" | "to", value: string) => {
        setSelectedLang((prev) => ({ ...prev, [type]: value }));
    };

    function swap() {
        sound.playPebbleTap(true);
        setSelectedLang((prev) => ({
            from: prev.to,
            to: prev.from,
        }));
        setTextToTranslate(result);
        setResult(textToTranslate);
    }

    const handleTranslation = async (e: FormEvent) => {
        e.preventDefault();
        if (!textToTranslate.trim()) return;

        setIsLoading(true);
        setResult("");
        setError("");
        sound.playPebbleTap(true);

        try {
            const data = await translate(
                textToTranslate,
                selectedLang.from,
                selectedLang.to,
            );

            const translated =
                data?.response?.data?.translations?.translatedText ?? null;

            if (translated) {
                setResult(
                    Array.isArray(translated) ? translated[0] : String(translated),
                );
                recordActivity("translation");
            } else {
                setError("Translation failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-lg pb-8">
            {/* Page header — matches Studio / sanctuary */}
            <header className="mb-6">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <Languages className="h-3.5 w-3.5" />
                    Studio · Translate
                </p>
                <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    From one tongue to another
                </h1>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    A calm desk for moving meaning. Type, listen, or glance — then hear both sides.
                </p>
            </header>

            {/* Language path card */}
            <section
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
                aria-label="Language path"
            >
                <div className="lang-wash pointer-events-none absolute inset-0 opacity-60" aria-hidden />

                <div className="relative flex items-center gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1 space-y-1.5">
                        <label
                            htmlFor="lang-from"
                            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            From
                        </label>
                        <Select
                            value={selectedLang.from}
                            onValueChange={(value) => handleLangChange("from", value)}
                        >
                            <SelectTrigger
                                id="lang-from"
                                className="h-11 rounded-xl border-border bg-background/80"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map((l) => (
                                    <SelectItem key={l.value} value={l.value}>
                                        <span className="flex items-center gap-2">
                                            <span aria-hidden>{l.flag}</span>
                                            {l.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={swap}
                        aria-label="Swap languages"
                        className="mt-5 size-10 shrink-0 rounded-full border-border bg-background shadow-xs transition-transform hover:scale-105"
                    >
                        <ArrowLeftRight className="h-4 w-4 text-primary" />
                    </Button>

                    <div className="min-w-0 flex-1 space-y-1.5">
                        <label
                            htmlFor="lang-to"
                            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Into
                        </label>
                        <Select
                            value={selectedLang.to}
                            onValueChange={(value) => handleLangChange("to", value)}
                        >
                            <SelectTrigger
                                id="lang-to"
                                className="h-11 rounded-xl border-border bg-background/80"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map((l) => (
                                    <SelectItem key={l.value} value={l.value}>
                                        <span className="flex items-center gap-2">
                                            <span aria-hidden>{l.flag}</span>
                                            {l.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="relative mt-3 text-center text-[11px] text-muted-foreground">
                    <span aria-hidden>{fromLang?.flag}</span>{" "}
                    {fromLang?.name ?? selectedLang.from}
                    <span className="mx-1.5 text-primary">→</span>
                    <span aria-hidden>{toLang?.flag}</span>{" "}
                    {toLang?.name ?? selectedLang.to}
                </p>
            </section>

            {/* Result sanctuary */}
            <div className="mt-4">
                <ResultComponent
                    output={result}
                    selectedLang={selectedLang}
                    mood={cairnMood}
                    isLoading={isLoading}
                />
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            {/* Input desk */}
            <div className="mt-4">
                <TranslationForm
                    handleTranslation={handleTranslation}
                    setTextToTranslate={setTextToTranslate}
                    textToTranslate={textToTranslate}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default TranslationManager;
