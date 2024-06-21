"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";

type Props = {};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SpeechToText = (props: Props) => {
  const recognition = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();

    // recognition.current.lang = "en-US";
    // recognition.current.continuous = true;
    // recognition.current.interimResults = true;
    recognition.current.start();
  };

  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  return (
    <div className="">
      <Button onClick={() => startListening()}>
        <p className="font-bold">Start to speak</p>
      </Button>
    </div>
  );
};

export default SpeechToText;
