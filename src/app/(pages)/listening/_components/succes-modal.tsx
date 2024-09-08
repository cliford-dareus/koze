import DefinitionTranslationTabs from "@/components/definition-translation-tabs";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

type Props = {
  quote: string;
  completeLevel: () => void;
};

const SuccessModal = ({ quote, completeLevel }: Props) => {
  return (
    <div className="overflow-hidden">
      <div className="text-center">
        <DialogTitle asChild>
          <h3 className="font-bold text-xl ">Congratulation</h3>
        </DialogTitle>
        <DialogDescription asChild>
          <p className="text-xs text-slate-300 mt-2">
            You have successefully choose the correct answer!
          </p>
        </DialogDescription>
      </div>

      <div className="bg-accent p-2 my-4 flex items-center justify-center rounded-sm">
        800 correct Answer
      </div>

      <div className="mt-2 h-[60px] flex items-center gap-2 overflow-x-scroll">
        {quote.split(" ").map((word: string, index: number) => (
          <div key={index}>
            <Drawer>
              <DrawerTrigger className="bg-accent px-4 py-1 rounded-md  text-white">
                {word}
              </DrawerTrigger>
              <DrawerContent>
                <DefinitionTranslationTabs word={word} />
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button onClick={() => completeLevel()}>Complete Level</Button>
      </div>
    </div>
  );
};

export default SuccessModal;
