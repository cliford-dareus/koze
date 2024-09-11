"use client";

import getTTS from "@/_actions/text-to-speech";
import clsx from "clsx";
import React, { useState } from "react";
import { Button } from "./ui/button";
import createBlobFromAudioURL from "@/app/(pages)/reading/_actions/create-blob-from-audio";

type Props = {
  text: string;
  lang?: string;
  classnames?: string;
  children?: React.ReactNode;
  prepareAudio?: (dat: Blob) => Promise<void>;
  isPlaying: boolean;
};

const TextToSpeechButton = ({
  text,
  lang = "en",
  classnames,
  prepareAudio,
  children,
  isPlaying,
}: Props) => {
  const [data, setData] = useState<string | null>(null);

  const playAudio = async () => {
    const arrayBuffer = await createBlobFromAudioURL(data!);
    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: "audio/mpeg",
    });

    prepareAudio && (await prepareAudio(blob));
  };

  console.log(isPlaying);

  React.useEffect(() => {
    if (isPlaying || !lang || !text) return;
    const fetchAudio = async () => {
      const audioData = await getTTS(lang, text);

      if (!audioData) return;
      setData(JSON.parse(audioData).URL);
    };

    fetchAudio();
  }, []);

  return (
    <Button disabled={isPlaying} className={clsx("gap-4 shadow-md", classnames)} onClick={playAudio}>
      {children}
    </Button>
  );
};

export default TextToSpeechButton;
