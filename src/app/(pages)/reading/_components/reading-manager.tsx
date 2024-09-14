"use client";

import { useTranscriber } from "@/app/_components/providers/transcribe-provider";
import SpeechToText, { AudioDataType } from "@/app/_components/speech-to-text";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

type Props = {
  quote: string;
};

const ReadingManager = ({ quote }: Props) => {
  const { start, output } = useTranscriber();
  const [audioData, setAudioData] = useState<AudioDataType | undefined>(
    undefined,
  );

  return (
    <div className="px-4">
      <div className="">
        <h1 className="font-bold text-slate-300 leading-4">
          Reapeat <br /> Pronunciation
        </h1>

        <p className="font-bold text-xl leading-5 text-center mt-16">{quote}</p>
      </div>

      <div className="mt-16 w-full flex justify-center">
        <SpeechToText setAudioData={setAudioData} />
      </div>

      {audioData && (
        <div>
          <Button
            onClick={() => {
              console.log("Check");
              start(audioData.buffer);
            }}
          >
            Check
          </Button>
        </div>
      )}

      {output && <div>{output.text}</div>}
    </div>
  );
};

export default ReadingManager;
