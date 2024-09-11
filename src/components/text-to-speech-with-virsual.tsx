"use client";

import { LucideSpeech } from "lucide-react";
import TextToSpeechButton from "./text-to-speech-button";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import loadAudioWorklet from "@/lib/load-audioworklet";

type Props = {
  randomFact: string;
  classname: string;
};

const TextToSpeechWithVirsual = ({ randomFact, classname }: Props) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(
    null,
  );
  const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  console.log("RENDER");

  const prepareAudio = async (data: Blob) => {
    setIsPlaying(true);

    // Initialize audio context
    contextRef.current = new window.AudioContext();
    setAudioContext(contextRef.current);

    await loadAudioWorklet(contextRef);

    // Load and play audio
    const buffer = await data.arrayBuffer();
    const audioBuffer = await contextRef.current.decodeAudioData(buffer);
    const source = new AudioBufferSourceNode(contextRef.current, {
      buffer: audioBuffer,
      // loop: true,
    });

    const worklet = new AudioWorkletNode(contextRef.current, "audio-processor");
    const analyserNode = contextRef.current.createAnalyser();

    source.connect(worklet);
    worklet.connect(analyserNode);
    analyserNode.connect(contextRef.current.destination);
    source.start(0);

    setAnalyser(analyserNode);
    setSourceNode(source);
    setWorkletNode(worklet);
  };

  const stopAudio = () => {
    contextRef.current?.close();

    if (sourceNode) {
      sourceNode.stop(0);
      setSourceNode(null);
    }
    if (workletNode) {
      workletNode.disconnect();
      setWorkletNode(null);
    }

    setIsPlaying(false);
  };

  useLayoutEffect(() => {
    const animate = () => {
      if (!analyser || !contextRef.current) return;

      const amplitudeArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(amplitudeArray);

      if (contextRef?.current.state === "running") {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const canvasContext = canvas.getContext(
          "2d",
        ) as CanvasRenderingContext2D;

        canvasContext?.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < amplitudeArray.length; i++) {
          const value = amplitudeArray[i] / 256;
          const y = canvas.height - canvas.height * value + 10;
          canvasContext.fillStyle = "white";
          canvasContext.fillRect(i, y, 2, 2);
        }
      }
      if (isPlaying) animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    sourceNode?.addEventListener("ended", () => stopAudio());

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      sourceNode?.removeEventListener("ended", () => stopAudio());
    };
  }, [analyser]);

  return (
    <>
      <div className={cn("", classname)}>
        <canvas className="w-full h-full" ref={canvasRef} />
      </div>

      <TextToSpeechButton
        classnames="w-[70%] bg-accent text-white self-center"
        text={randomFact}
        prepareAudio={prepareAudio}
        isPlaying={isPlaying}
      >
        <LucideSpeech size={24} />
        <p className="font-bold text-base">Tap to Listen</p>
      </TextToSpeechButton>
    </>
  );
};

export default TextToSpeechWithVirsual;
