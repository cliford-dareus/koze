import DefinitionTranslationTabs from "@/app/_components/definition-translation-tabs";
import { Button } from "@/app/_components/ui/button";
import { DialogDescription, DialogTitle } from "@/app/_components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";

type Props = {
  quote: string;
  completeLevel: () => void;
};

const SuccessModal = ({ quote, completeLevel }: Props) => {
  return (
    <div className="overflow-hidden">
      <div className="text-center">
        <DialogTitle asChild>
          <h3 className="font-display text-xl font-medium">Well heard</h3>
        </DialogTitle>
        <DialogDescription asChild>
          <p className="mt-2 text-sm text-muted-foreground">
            You chose the correct sentence. Progress is saved on this device.
          </p>
        </DialogDescription>
      </div>

      <div className="my-4 flex items-center justify-center rounded-lg bg-accent p-3 text-sm font-medium text-accent-foreground">
        Listening · +1
      </div>

      <div className="mt-2 flex h-[60px] items-center gap-2 overflow-x-auto">
        {quote.split(" ").map((word: string, index: number) => (
          <div key={index}>
            <Drawer>
              <DrawerTrigger className="rounded-md bg-muted px-3 py-1 text-sm">
                {word}
              </DrawerTrigger>
              <DrawerContent className="border-border bg-background">
                <DefinitionTranslationTabs word={word} />
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={() => completeLevel()}>
          Next sentence
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
