"use client";

import { getDefinition, translate } from "@/app/_actions/translate";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Group, groupSimilarMeanings } from "@/lib/utils";
import { LucidePlay } from "lucide-react";
import TextToSpeechButton from "./text-to-speech-button";

type Props = {
    word: string;
};

const DefinitionTranslationTabs = ({ word }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [meaningBytype, setMeaningBytype] = React.useState<
        {
            title: string;
            content: Group;
        }[]
    >([]);
    const [translation, setTranslation] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            setSuggestions([]);
            setMeaningBytype([]);

            const cleaned = word.replace(/^"|"$/g, "");

            try {
                const [definition, translationResult] = await Promise.all([
                    getDefinition(cleaned),
                    translate(cleaned, "en", "fr"),
                ]);

                if (definition && "ok" in definition && definition.ok) {
                    const groupedMeanings = groupSimilarMeanings(definition.meanings);
                    const meaningsByType = Object.keys(groupedMeanings).map(
                        (partOfSpeech) => ({
                            title: partOfSpeech,
                            content: groupedMeanings[partOfSpeech],
                        }),
                    );
                    setMeaningBytype(meaningsByType);
                } else if (definition && "ok" in definition && !definition.ok) {
                    setError(definition.error || "Definition unavailable.");
                    if (
                        "suggestions" in definition &&
                        Array.isArray(definition.suggestions)
                    ) {
                        setSuggestions(definition.suggestions);
                    }
                }

                const translated =
                    translationResult?.response?.data?.translations?.translatedText;
                if (translated) {
                    setTranslation(
                        Array.isArray(translated) ? translated[0] : String(translated),
                    );
                }
            } catch (err) {
                console.log(err);
                setError("Could not load word details.");
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [word]);

    return (
        <div className="p-4">
            <Tabs className="max-h-[80vh]" defaultValue="definition">
                <TabsList>
                    <TabsTrigger value="definition">Definition</TabsTrigger>
                    <TabsTrigger value="translation">Translation</TabsTrigger>
                </TabsList>
                <div className="max-h-[80vh] overflow-y-auto">
                    <TabsContent value="definition">
                        {loading && (
                            <p className="text-sm text-muted-foreground">Looking up…</p>
                        )}
                        {!loading && error && (
                            <div className="space-y-2">
                                <p className="text-sm text-destructive">{error}</p>
                                {suggestions.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Suggestions
                                        </p>
                                        <ul className="mt-2 flex flex-wrap gap-2">
                                            {suggestions.map((s) => (
                                                <li
                                                    key={s}
                                                    className="rounded-full border border-border px-3 py-1 text-sm"
                                                >
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {!loading &&
                            !error &&
                            meaningBytype.map((content, index) => (
                                <article key={index} className="mb-4">
                                    <h3 className="font-display text-lg font-medium capitalize">
                                        {content.title}
                                    </h3>
                                    <ul className="mb-4 ml-4 list-decimal">
                                        {content.content.definitions.map((def) => (
                                            <li className="mt-2" key={def.definition + def.example}>
                                                {def.definition}
                                                <br />
                                                {def.example ? (
                                                    <span className="text-muted-foreground">
                                                        “{def.example}”
                                                    </span>
                                                ) : null}
                                                {def.synonyms.length > 0 && (
                                                    <span className="mt-2 flex flex-wrap items-center gap-1">
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            synonyms
                                                        </span>
                                                        {def.synonyms.map((syn) => (
                                                            <span
                                                                key={syn}
                                                                className="rounded-full border border-primary/40 px-2.5 py-0.5 text-xs"
                                                            >
                                                                {syn}
                                                            </span>
                                                        ))}
                                                    </span>
                                                )}
                                                {def.antonyms.length > 0 && (
                                                    <span className="mt-2 flex flex-wrap items-center gap-1">
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            antonyms
                                                        </span>
                                                        {def.antonyms.map((ant) => (
                                                            <span
                                                                key={ant}
                                                                className="rounded-full border border-destructive/30 px-2.5 py-0.5 text-xs"
                                                            >
                                                                {ant}
                                                            </span>
                                                        ))}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                    </TabsContent>
                    <TabsContent value="translation">
                        <div>
                            <h3 className="font-display text-lg font-medium">{word}</h3>
                        </div>
                        <div className="flex gap-4">
                            <TextToSpeechButton
                                isPlaying={isPlaying}
                                text={word}
                                classnames="py-4"
                            >
                                <LucidePlay size={20} />
                                <p>{word}</p>
                            </TextToSpeechButton>

                            <TextToSpeechButton
                                isPlaying={isPlaying}
                                text={translation}
                                lang="fr"
                                classnames="py-4"
                            >
                                <LucidePlay size={20} />
                                <p>{translation || "…"}</p>
                            </TextToSpeechButton>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default DefinitionTranslationTabs;
