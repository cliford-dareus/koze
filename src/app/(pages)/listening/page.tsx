import TextToSpeechButton from "@/components/text-to-speech-button";
import { LucideSpeech } from "lucide-react";
import { getRandomFacts } from "@/_actions/translate";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import DefinitionTranslationTabs from "@/components/definition-translation-tabs";

type Props = {};

const Listening = async (props: Props) => {
  const randomFact = await getRandomFacts();

  if(randomFact === null) return

  return (
    <div className="h-full">
      <div className="border rounded-md p-4 h-[25vh]">
        <p>{randomFact?.text}</p>
        {/* <p className="font-medium mt-2 italic">{randomFact?.author}</p> */}
      </div>
      <div className="border rounded-md p-4 mt-4">
        <TextToSpeechButton
          classnames="w-full rounded bg-gradient-to-br from-indigo-500 to-slate-500 text-white"
          text={randomFact?.text as unknown as string}
        >
          <LucideSpeech size={35} />
          <p className="font-bold">Tap to Listen</p>
        </TextToSpeechButton>
      </div>

      <div className="border rounded-md  mt-4 h-[60px] flex items-center gap-2 overflow-x-scroll">
        {randomFact?.text.split(" ").map((word: string, index: number) => (
          <div key={index}>
            <Drawer>
              <DrawerTrigger className="bg-blue-400 px-4 py-1 rounded-md min-w-[100px] text-white">
                {word}
              </DrawerTrigger>
              <DrawerContent>
                <DefinitionTranslationTabs word={word} />
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listening;
