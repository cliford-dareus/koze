"use client";

import { LucideSpeech } from "lucide-react";
import TextToSpeechButton from "./text-to-speech-button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import loadAudioWorklet from "@/lib/load-audioworklet";

type Props = {
    randomFact: string;
    classname: string;
};

const TextToSpeechWithVirsual = ({ randomFact, classname }: Props) => {
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(
        null
    );
    const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef<number | null>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const closeContext = useCallback(() => {
        if (contextRef.current && contextRef.current.state !== "closed") {
            contextRef.current.close();
        }
        contextRef.current = null;
    }, []);

    const stopAudio = useCallback(() => {
        sourceNode?.stop(0);
        workletNode?.disconnect();
        closeContext();

        setSourceNode(null);
        setWorkletNode(null);
        setAnalyser(null);
        setIsPlaying(false);
    }, [sourceNode, workletNode, closeContext]);

    const prepareAudio = async (data: Blob) => {
        if (isPlaying) {
            stopAudio();
        }

        setIsPlaying(true);

        contextRef.current = new window.AudioContext();

        await loadAudioWorklet(contextRef);

        const buffer = await data.arrayBuffer();
        const audioBuffer = await contextRef.current.decodeAudioData(buffer);
        const source = new AudioBufferSourceNode(contextRef.current, {
            buffer: audioBuffer,
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

    useEffect(() => {
        const animate = () => {
            if (analyser && contextRef.current?.state === "running") {
                const amplitudeArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteTimeDomainData(amplitudeArray);

                const canvas = canvasRef.current;
                const canvasContext = canvas?.getContext("2d");

                if (canvas && canvasContext) {
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < amplitudeArray.length; i++) {
                        const value = amplitudeArray[i] / 256;
                        const y = canvas.height - canvas.height * value + 10;
                        canvasContext.fillStyle = "white";
                        canvasContext.fillRect(i, y, 2, 2);
                    }
                }
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animate();

        const handleEnded = () => stopAudio();
        sourceNode?.addEventListener("ended", handleEnded);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            sourceNode?.removeEventListener("ended", handleEnded);
        };
    }, [analyser, isPlaying, sourceNode, stopAudio]);

    // Clean up on unmount if still playing
    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            closeContext();
        };
    }, [closeContext]);

    return (
        <>
            <div className={cn("", classname)}>
                <canvas className="w-full h-full" ref={canvasRef} />
            </div>

            <TextToSpeechButton
                classnames="text-white self-center"
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
