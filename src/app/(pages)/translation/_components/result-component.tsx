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
    <div className="bg-primary-gradient relative p-4 h-[35vh] rounded-lg">
      <div className="absolute right-4">
        <Select
          value={selectedLang.from}
          onValueChange={(value) => handleLangChange("from", value)}
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

      {!output ? (
        <div className="h-full flex flex-col items-center">
          <div className=""></div>
          <div className="w-[80%] mt-auto text-center">
            <h1 className="text-xl font-bold">Translate with ease</h1>
            <p className="text-sm text-slate-300">
              Translate anything from image, files and text
            </p>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center w-full">
            <TypewriterEffect text={output} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultComponent;
