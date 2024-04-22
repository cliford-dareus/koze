"use client";

import getTTS from "@/_actions/text-to-speech";
import clsx from "clsx";
import React from "react";

type Props = {
  text: string;
  lang?: string;
  classnames?: string;
  children?: React.ReactNode;
};

const TextToSpeechButton = ({
  text,
  lang = "en",
  classnames,
  children,
}: Props) => {
  const [data, setData] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  let audio: HTMLAudioElement | null = null;

  const playAudio = async () => {
    if (audio !== null) {
      audio.pause();
    }
    audio = new Audio();
    audio.currentTime = 0;
    audio.src = data!;
    audio.play();
    setIsPlaying(true);
    audio.addEventListener("ended", () => setIsPlaying(false));
  };

  React.useEffect(() => {
    if (isPlaying) return;
    const fetchAudio = async () => {
      const audioData = await getTTS(lang, text);
      if (!audioData) return;
      setData(audioData);
    };
    fetchAudio();
  });

  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-4 shadow-md",
        classnames
      )}
      onClick={playAudio}
    >
      {children}
    </button>
  );
};

export default TextToSpeechButton;
