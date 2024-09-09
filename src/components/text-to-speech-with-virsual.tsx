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
  const [animations, setAnimations] = useState(Array(10).fill({ y: 0 }));
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
      const frequencyData = new Uint8Array(
        analyser.frequencyBinCount,
      );
      analyser.getByteFrequencyData(frequencyData);

      // Map frequency data to y-positions for each spike
      const newAnimations = animations.map((_, index) => ({
        y: -(frequencyData[index * 5] / 2), // Adjust this mapping as needed
        transition: { duration: 0.1 },
      }));

      setAnimations(newAnimations);
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
            d="M1 67L16.5 12"
            stroke="white"
            strokeWidth="2"
            animate={animations[0]}
          />
          <motion.path
            d="M16.5 12L38 57.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[1]}
          />
          <motion.path
            d="M38 57.5L45.5 8"
            stroke="white"
            strokeWidth="2"
            animate={animations[2]}
          />
          <motion.path
            d="M45.5 8L54 49"
            stroke="white"
            strokeWidth="2"
            animate={animations[3]}
          />
          <motion.path
            d="M54 49L66.5 22"
            stroke="white"
            strokeWidth="2"
            animate={animations[4]}
          />
          <motion.path
            d="M66.5 22L72 49"
            stroke="white"
            strokeWidth="2"
            animate={animations[5]}
          />
          <motion.path
            d="M72 49L87.5 19.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[6]}
          />
          <motion.path
            d="M87.5 19.5L106.5 67"
            stroke="white"
            strokeWidth="2"
            animate={animations[7]}
          />
          <motion.path
            d="M106.5 67L127.5 19.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[8]}
          />
          <motion.path
            d="M127.5 19.5L155.5 57.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[9]}
          />
          <motion.path
            d="M155.5 57.5L163 8"
            stroke="white"
            strokeWidth="2"
            animate={animations[10]}
          />
          <motion.path
            d="M163 8L203 49"
            stroke="white"
            strokeWidth="2"
            animate={animations[11]}
          />
          <motion.path
            d="M203 49L215.5 2"
            stroke="white"
            strokeWidth="2"
            animate={animations[12]}
          />
          <motion.path
            d="M215.5 2L237 57.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[13]}
          />
          <motion.path
            d="M237 57.5C244.333 44.6667 259.2 19.6 260 22"
            stroke="white"
            strokeWidth="2"
            animate={animations[14]}
          />
          <motion.path
            d="M260 22C260.8 24.4 264.667 49.6667 266.5 62"
            stroke="white"
            strokeWidth="2"
            animate={animations[15]}
          />
          <motion.path
            d="M266.5 62L280 5.5"
            stroke="white"
            strokeWidth="2"
            animate={animations[16]}
          />
        </svg>
      </div>

      <TextToSpeechButton
        classnames="w-[70%] bg-accent text-white self-center"
        text={randomFact?.text as unknown as string}
        prepareAudio = {prepareAudio}
      >
        <LucideSpeech size={24} />
        <p className="font-bold text-base">Tap to Listen</p>
      </TextToSpeechButton>
    </>
  );
};

export default TextToSpeechWithVirsual;
