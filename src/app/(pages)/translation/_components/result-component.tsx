import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/app/_components/ui/select";
import { supportedLanguages } from "./translation-manager";
import TypewriterEffect from "@/app/_components/typewriter-text";

type Props = {
  handleLangChange: (type: "from" | "to", value: string) => void;
  selectedLang: { from: string; to: string };
  output: string;
};

const ResultComponent = ({
  handleLangChange,
  selectedLang,
  output,
}: Props) => {
  return (
    <div className="relative min-h-[32vh] rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="absolute right-4 top-4">
        <Select
          value={selectedLang.to}
          onValueChange={(value) => handleLangChange("to", value)}
        >
          <SelectTrigger className="h-9 rounded-full border-border bg-muted px-4">
            To · {selectedLang.to.toUpperCase()}
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
      </div>

      {!output ? (
        <div className="flex h-full min-h-[28vh] flex-col items-center justify-end pb-2 text-center">
          <h1 className="font-display text-2xl font-medium">
            From one tongue to another
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Translate from image, voice, or text — then hear both sides.
          </p>
        </div>
      ) : (
        <div className="flex min-h-[28vh] items-center justify-center pt-8">
          <div className="w-full text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Translation
            </p>
            <div className="font-display text-2xl leading-snug">
              <TypewriterEffect text={output} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultComponent;
