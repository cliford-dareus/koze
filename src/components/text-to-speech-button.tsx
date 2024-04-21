"use client";

import React from "react";
import { Button } from "./ui/button";

type Props = {
  data: any;
  children?: React.ReactNode;
};

const TextToSpeechButton = ({ data, children }: Props) => {
  const [audioURL, setAudioURL] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  let audio: HTMLAudioElement | null = null;

  const playAudio = async () => {
    if (audio !== null) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio = new Audio();
    audio.src = data;
    audio.play();
    setAudioURL(data);
    setIsPlaying(true);
    audio.addEventListener("ended", () => setIsPlaying(false));
  };

  return (
    <button
      className="w-full flex items-center justify-center gap-4 p-4  bg-slate-100 shadow-md "
      onClick={playAudio}
    >
      {children}
    </button>
  );
};

export default TextToSpeechButton;
