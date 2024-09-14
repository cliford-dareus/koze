"use client";

import { Button } from "@/app/_components/ui/button";
import { getMimeType } from "@/app/_lib/get-mimetype";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  setAudioData: Dispatch<SetStateAction<AudioDataType | undefined>>;
};

export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

export type AudioDataType = {
  buffer: AudioBuffer;
  url: string;
  source: AudioSource;
  mimeType: string;
};

const SpeechToText = ({ setAudioData }: Props) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [blobRecorded, setBlobRecorded] = useState<Blob | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecordRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    setBlobRecorded(null);
    let startTime = Date.now();

    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecordRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
        if (mediaRecorder.state === "inactive") {
          const duration = Date.now() - startTime;

          // Received a stop event
          let blob = new Blob(chunksRef.current, { type: mimeType });

          if (mimeType === "audio/webm") {
            // blob = await webmFixDuration(blob, duration, blob.type);
          }

          setBlobRecorded(blob);
          onRecordingComplete(blob);
          chunksRef.current = [];
        }
      });

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecordRef.current &&
      mediaRecordRef.current.state === "recording"
    ) {
      mediaRecordRef.current.stop(); // set state to inactive
      setDuration(0);
      setRecording(false);
    }
  };

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

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (recording) {
      const timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }

    return () => {
      if (stream) {
        (stream as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [recording]);

  const handleRecorder = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="w-[70%]" onClick={() => handleRecorder()}>
      <Button className="font-bold">
        {!recording ? "Start Recording" : "Stop Recording"}
      </Button>
    </div>
  );
};

export default SpeechToText;
