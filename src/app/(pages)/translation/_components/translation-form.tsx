import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/app/_components/ui/select";
import { supportedLanguages } from "./translation-manager";
import { Button } from "@/app/_components/ui/button";
import {
  LucideArrowRight,
  LucideCamera,
  LucideFolder,
  LucideMic,
} from "lucide-react";
import { Dispatch, FormEvent, SetStateAction } from "react";
import SpeechToText from "@/app/_components/speech-to-text";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
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
    <div className="bg-accent-foreground rounded-lg p-4 mt-4 relative">
      <div className="absolute left-4">
        <Select
          value={selectedLang.from}
          onValueChange={(value) => handleLangChange("to", value)}
        >
          <SelectTrigger className="border-none px-6 rounded-full h-[30px] bg-accent">
            From : {selectedLang.from}
          </SelectTrigger>
          <SelectContent className="border-none">
            <SelectGroup>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.id} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-12">
        <form onSubmit={handleTranslation}>
          <input
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
            className="bg-transparent outline-none border-none"
            placeholder="Enter your text here ..."
          />

          <div className="h-[35px] flex justify-between items-center mt-4 rounded-full bg-[rgba(217,217,217,40%)]">
            <div className="flex gap-4 ml-4 items-center">
              <CameraComponent setTextToTranslate={setTextToTranslate} />
              <>
                <label htmlFor="fi">
                  <LucideFolder size={20} />
                </label>
                <input name="fi" id="fi" type="file" hidden />
              </>
              <MicrophoneComponent />
            </div>

            <Button
              type="submit"
              className="h-[36px] w-[36px] rounded-full bg-background"
            >
              <div>
                <LucideArrowRight size={24} />
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TranslationForm;
