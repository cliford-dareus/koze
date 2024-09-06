"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type Props = {
  onRecordingComplete: (blob: Blob) => void;
};

const SpeechToText = (props: Props) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [blobRecorded, setBlobRecorded] = useState<Blob | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecordRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  

  const startListening = async () => {
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
          props.onRecordingComplete(blob);
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
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recording]);

  const handleRecorder = () => {
    if (recording) {
      stopRecording();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative flex ">
      <Button
        onClick={() => handleRecorder()}
      >
        <p className="font-bold">
          {recording ? `Stop Recording` : "Start Recording"}
        </p>
      </Button>
    </div>
  );
};

function getMimeType() {
  const types = [
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
}

export default SpeechToText;
