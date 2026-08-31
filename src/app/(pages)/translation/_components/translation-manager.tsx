"use client";

import { FormEvent, useState } from "react";
import ResultComponent from "./result-component";
import TranslationForm from "./translation-form";
import { translate } from "@/app/_actions/translate";
import { LANGUAGES } from "@/lib/languages";
import { recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";

const TranslationManager = () => {
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [textToTranslate, setTextToTranslate] = useState("");
    const [selectedLang, setSelectedLang] = useState({
        from: "en",
        to: "fr",
    });

    const handleLangChange = (type: "from" | "to", value: string) => {
        setSelectedLang((prevState) => ({
            ...prevState,
            [type]: value,
        }));
    };

    function swap() {
        setSelectedLang((prevState) => ({
            ...prevState,
            from: selectedLang.to,
            to: selectedLang.from,
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
        <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Translate
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium">
                From one tongue to another.
            </h1>

            <div className="mt-6 flex items-center gap-2">
                <Select value={selectedLang.from} onValueChange={(value) => handleLangChange("from", value)}>
                    <SelectTrigger className="flex-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                                {l.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={swap}
                    aria-label="Swap languages"
                >
                    <ArrowLeftRight />
                </Button>
                <Select value={selectedLang.to} onValueChange={(value) => handleLangChange("to", value)}>
                    <SelectTrigger className="flex-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                                {l.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-6">
                <ResultComponent output={result} selectedLang={selectedLang} />

                {error && (
                    <p className="mt-3 text-center text-sm text-destructive">{error}</p>
                )}
                {isLoading && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                        Translating…
                    </p>
                )}

                <TranslationForm
                    handleTranslation={handleTranslation}
                    setTextToTranslate={setTextToTranslate}
                    textToTranslate={textToTranslate}
                />
            </div>
        </div>
    );
};

export default TranslationManager;
