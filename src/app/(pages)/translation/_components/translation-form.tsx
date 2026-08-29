import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/app/_components/ui/select";
import { supportedLanguages } from "./translation-manager";
import { Button } from "@/app/_components/ui/button";
import { LucideArrowRight, LucideFolder } from "lucide-react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import MicrophoneComponent from "./ microphone-component";
import CameraComponent from "./camera-component";

type Props = {
  handleLangChange: (type: "from" | "to", value: string) => void;
  selectedLang: { from: string; to: string };
  handleTranslation: (e: FormEvent) => Promise<void>;
  setTextToTranslate: Dispatch<SetStateAction<string>>;
  textToTranslate: string;
};

const TranslationForm = ({
  handleLangChange,
  selectedLang,
  handleTranslation,
  setTextToTranslate,
  textToTranslate,
}: Props) => {
  return (
    <div className="relative mt-4 rounded-xl border border-border bg-card p-4 shadow-soft">
      <Select
        value={selectedLang.from}
        onValueChange={(value) => handleLangChange("from", value)}
      >
        <SelectTrigger className="h-9 w-auto rounded-full border-border bg-muted px-4">
          From · {selectedLang.from.toUpperCase()}
        </SelectTrigger>
        <SelectContent className="border-border bg-card">
          <SelectGroup>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.id} value={lang.value}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

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
