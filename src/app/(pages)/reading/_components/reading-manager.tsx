"use client";

import { useTranscriber } from "@/components/providers/transcribe-provider";
import { useState } from "react";
import SpeechToText from "./speech-to-text";
import { Button } from "@/components/ui/button";

type Props = {
  quote: string;
};

export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

const ReadingManager = ({ quote }: Props) => {
  const { start, output } = useTranscriber();
  const [audioData, setAudioData] = useState<
    | {
        buffer: AudioBuffer;
        url: string;
        source: AudioSource;
        mimeType: string;
      }
    | undefined
  >(undefined);

  const onRecordingComplete = (data: Blob) => {
    setAudioData(undefined);

    const blobUrl = URL.createObjectURL(data);
    const fileReader = new FileReader();
    fileReader.onprogress = (event) => {
      // setProgress(event.loaded / event.total || 0);
    };
    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({
        sampleRate: 16000,
      });
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const decoded = await audioCTX.decodeAudioData(arrayBuffer);
      // setProgress(undefined);
      setAudioData({
        buffer: decoded,
        url: blobUrl,
        source: AudioSource.RECORDING,
        mimeType: data.type,
      });
    };
    fileReader.readAsArrayBuffer(data);
  };

  return (
    <div className="px-4">
      <div className="">
        <h1 className="font-bold text-slate-300 leading-4">
          Reapeat <br /> Pronunciation
        </h1>

        <p className="font-bold text-xl leading-5 text-center mt-16">{quote}</p>
      </div>

      <div className="mt-16 w-full flex justify-center">
        <SpeechToText onRecordingComplete={onRecordingComplete} />
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
