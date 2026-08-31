import { Button } from "@/app/_components/ui/button";
import { LucideArrowRight, LucideFolder } from "lucide-react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import MicrophoneComponent from "./ microphone-component";
import CameraComponent from "./camera-component";
    
type Props = {
    handleTranslation: (e: FormEvent) => Promise<void>;
    setTextToTranslate: Dispatch<SetStateAction<string>>;
    textToTranslate: string;
};

const TranslationForm = ({
    handleTranslation,
    setTextToTranslate,
    textToTranslate,
}: Props) => {
    return (
        <div className="relative mt-4 rounded-xl border border-border bg-card p-4 shadow-soft">
            <form onSubmit={handleTranslation} className="mt-4">
                <input
                    value={textToTranslate}
                    onChange={(e) => setTextToTranslate(e.target.value)}
                    className="w-full border-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    placeholder="Type a sentence, or scan with the camera…"
                />

                <div className="mt-4 flex h-11 items-center justify-between rounded-full bg-muted px-2">
                    <div className="ml-2 flex items-center gap-4 text-muted-foreground">
                        <CameraComponent setTextToTranslate={setTextToTranslate} />
                        <label htmlFor="fi" className="cursor-pointer">
                            <LucideFolder size={18} />
                        </label>
                        <input name="fi" id="fi" type="file" hidden accept="image/*" />
                        <MicrophoneComponent />
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        className="size-9 rounded-full"
                        disabled={!textToTranslate.trim()}
                        aria-label="Translate"
                    >
                        <LucideArrowRight size={18} />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TranslationForm;
