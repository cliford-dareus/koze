import getTTS from "@/_actions/text-to-speech";
import TextToSpeechButton from "@/components/text-to-speech-button";
import { LucideSpeaker, LucideSpeech } from "lucide-react";
import React from "react";
import fs from "fs";
import { Button } from "@/components/ui/button";

type Props = {};

const Listening = async (props: Props) => {
  //   const data = await getTTS("en", "Good morning! How are you today?");
  const data = "";

  return (
    <div className="h-full">
      <div className="border rounded-md p-4 h-[20vh]"></div>
      <div className="border rounded-md p-4 mt-4">
        <TextToSpeechButton data={data}>
          <LucideSpeech size={50} />
          <p>Tap to Listen</p>
        </TextToSpeechButton>
      </div>
      <div className="border rounded-md p-4 mt-4 flex gap-2 overflow-x-scroll">
        {"Good morning! How are you today?".split(" ").map((word, index) => (
          <Button key={index} className="">
            <p>{word}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Listening;
