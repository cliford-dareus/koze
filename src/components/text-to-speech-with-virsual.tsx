"use client";

import { LucideSpeech } from "lucide-react";
import TextToSpeechButton from "./text-to-speech-button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAnimation, motion } from "framer-motion";

type Props = {
  randomFact: any;
  classname: string;
};

const TextToSpeechWithVirsual = ({ randomFact, classname }: Props) => {
  const [audioData, setAudioData] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const controls = useAnimation();

  const prepareAudio = async (data: any) => {
    // Initialize audio context
    contextRef.current = new window.AudioContext();
    const analyserNode = contextRef.current.createAnalyser();
    setAudioContext(contextRef.current);
    setAnalyser(analyserNode);

    // Load and play audio
    const buffer = await data.arrayBuffer();
    const audioBuffer = await contextRef.current.decodeAudioData(buffer);
    const source = contextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyserNode);
    analyserNode.connect(contextRef.current.destination);
    source.start(0);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (contextRef.current) {
        contextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!analyser) return;

    const animate = () => {
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);

      // Use the average of the first few frequency bins
      const averageFrequency =
        frequencyData.slice(0, 4).reduce((a, b) => a + b) / 4;
      const scale = 1 + (averageFrequency / 255) * 0.5; // Scale between 1 and 1.5

      controls.start({ scale, transition: { duration: 0.1 } });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, controls]);

  return (
    <>
      <div className={cn("", classname)}>
        <svg
          width="281"
          height="69"
          viewBox="0 0 281 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.path
            d="M1 67L16.5 12L38 57.5L45.5 8L54 49L66.5 22L72 49L87.5 19.5L106.5 67L127.5 19.5L155.5 57.5L163 8L203 49L215.5 2L237 57.5C244.333 44.6667 259.2 19.6 260 22C260.8 24.4 264.667 49.6667 266.5 62L280 5.5"
            stroke="white"
            animate={controls}
          />
        </svg>
      </div>

      <TextToSpeechButton
        classnames="w-[70%] bg-accent text-white self-center"
        text={randomFact?.text as unknown as string}
      >
        <LucideSpeech size={24} />
        <p className="font-bold text-base">Tap to Listen</p>
      </TextToSpeechButton>
    </>
  );
};

export default TextToSpeechWithVirsual;
