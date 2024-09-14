"use client";

import { useWorker } from "@/app/hooks/useWorker";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface TranscriberData {
  isBusy: boolean;
  text: string;
  chunks: { text: string; timestamp: [number, number | null] }[];
}

export interface Transcriber {
  onInputChange: () => void;
  isBusy: boolean;
  isModelLoading: boolean;
  start: (audioData: AudioBuffer | undefined) => void;
  output?: TranscriberData;
  model: string;
  setModel: (model: string) => void;
  multilingual: boolean;
  setMultilingual: (model: boolean) => void;
  quantized: boolean;
  setQuantized: (model: boolean) => void;
  subtask: string;
  setSubtask: (subtask: string) => void;
  language?: string;
  setLanguage: (language: string) => void;
}

const transcriberContext = createContext<Transcriber | null>(null);

export const Transcriber = ({ children }: { children: React.ReactNode }) => {
  const [transcript, setTranscript] = useState<TranscriberData | undefined>(
    undefined,
  );
  const [isBusy, setIsBusy] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const webWorker = useWorker((event) => {
    const message = event.data;

    switch (message.status) {
      case "initiate":
        console.log("INITIATE");
        break;
      case "ready":
        console.log("READY");
        break;
      case "update":
        console.log("UPDATE");
        // TODO update the transcribe data on every chunk data
        break;
      case "complete":
        console.log("COMPLETE");
        console.log(message);
        const completeTranscripe = message as {
          data: {
            text: string;
            chunks: { text: string; timestamp: [number, number | null] }[];
          };
        };
        setTranscript({
          isBusy: false,
          text: completeTranscripe.data.text,
          chunks: completeTranscripe.data.chunks,
        });
        break;
    }
  });

  const [model, setModel] = useState<string>("Xenova/whisper-tiny");
  const [subtask, setSubtask] = useState<string>("transcribe");
  const [quantized, setQuantized] = useState<boolean>(false);
  const [multilingual, setMultilingual] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("english");

  const onInputChange = () => {};

  const postRequest = useCallback(
    async (audioData: AudioBuffer | undefined) => {
      if (audioData) {
        setTranscript(undefined);
        setIsBusy(true);

        let audio;
        if (audioData.numberOfChannels === 2) {
          const SCALING_FACTOR = Math.sqrt(2);

          let left = audioData.getChannelData(0);
          let right = audioData.getChannelData(1);

          audio = new Float32Array(left.length);
          for (let i = 0; i < audioData.length; ++i) {
            audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
          }
        } else {
          // If the audio is not stereo, we can just use the first channel:
          audio = audioData.getChannelData(0);
        }

        webWorker.postMessage({
          audio,
          model,
          multilingual,
          quantized,
          subtask: multilingual ? subtask : null,
          language: multilingual && language !== "auto" ? language : null,
        });
      }
    },
    [webWorker, model, multilingual, quantized, subtask, language],
  );

  const transcribe = useMemo(() => {
    return {
      onInputChange,
      isBusy,
      isModelLoading,
      start: postRequest,
      output: transcript,
      model,
      setModel,
      multilingual,
      setMultilingual,
      quantized,
      setQuantized,
      subtask,
      setSubtask,
      language,
      setLanguage,
    };
  }, [
    isBusy,
    isModelLoading,
    postRequest,
    transcript,
    model,
    multilingual,
    quantized,
    subtask,
    language,
  ]);

  return (
    <transcriberContext.Provider value={{ ...transcribe }}>
      {children}
    </transcriberContext.Provider>
  );
};

export const useTranscriber = () => {
  const context = useContext(transcriberContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
