"use client";

import { useTranscriber } from "@/app/_components/providers/transcribe-provider";
import SpeechToText, { AudioDataType } from "@/app/_components/speech-to-text";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { LucideMic } from "lucide-react";
import { useState } from "react";

const MicrophoneComponent = () => {
  const { start, output } = useTranscriber();
  const [audioData, setAudioData] = useState<AudioDataType | undefined>(
    undefined,
  );

  return (
    <Drawer>
      <DrawerTrigger className="">
        <LucideMic size={20} />
      </DrawerTrigger>
      <DrawerContent className="bg-primary-gradient border-none  pt-8 pb-20">
        <div className="px-4">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <div className="h-[100px] bg-red-50"></div>
          <SpeechToText setAudioData={setAudioData} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MicrophoneComponent;
