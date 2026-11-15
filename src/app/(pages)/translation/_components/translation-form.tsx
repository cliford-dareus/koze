"use client";

import { Button } from "@/app/_components/ui/button";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import MicrophoneComponent from "./ microphone-component";
import CameraComponent from "./camera-component";

type Props = {
    handleTranslation: (e: FormEvent) => Promise<void>;
    setTextToTranslate: Dispatch<SetStateAction<string>>;
    textToTranslate: string;
    isLoading?: boolean;
};

const TranslationForm = ({
    handleTranslation,
    setTextToTranslate,
    textToTranslate,
    isLoading,
}: Props) => {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Offer words
            </p>

            <form onSubmit={handleTranslation}>
                <label htmlFor="translate-input" className="sr-only">
                    Text to translate
                </label>
                <textarea
                    id="translate-input"
                    rows={3}
                    value={textToTranslate}
                    onChange={(e) => setTextToTranslate(e.target.value)}
                    className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                    placeholder="Type a sentence, or capture with camera…"
                    disabled={isLoading}
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-1 text-muted-foreground">
                        <CameraComponent setTextToTranslate={setTextToTranslate} />
                        <label
                            htmlFor="fi"
                            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground"
                            title="Upload image"
                        >
                            <FolderOpen className="h-4 w-4" />
                            <span className="sr-only">Upload image</span>
                        </label>
                        <input name="fi" id="fi" type="file" hidden accept="image/*" />
                        <MicrophoneComponent />
                    </div>

                    <Button
                        type="submit"
                        size="sm"
                        className="h-10 rounded-full px-4 font-semibold shadow-xs"
                        disabled={!textToTranslate.trim() || isLoading}
                        aria-label="Translate"
                    >
                        {isLoading ? (
                            "Working…"
                        ) : (
                            <>
                                Translate
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TranslationForm;
