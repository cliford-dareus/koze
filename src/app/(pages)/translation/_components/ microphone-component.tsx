import SpeechToText from "@/app/_components/speech-to-text";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { LucideMic } from "lucide-react";

const MicrophoneComponent = () => {
  return (
    <Drawer>
      <DrawerTrigger className="">
        <LucideMic size={20} />
      </DrawerTrigger>
      <DrawerContent className="bg-primary-gradient border-none">
        <DrawerTitle></DrawerTitle>
        <DrawerDescription></DrawerDescription>
        <SpeechToText setAudioData={() => {}} />
      </DrawerContent>
    </Drawer>
  );
};

export default MicrophoneComponent;
