"use client";

import { Button } from "@/app/_components/ui/button";
import { getMimeType } from "@/lib/get-mimetype";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";

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
    const [liveStream, setLiveStream] = useState<MediaStream | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecordRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setBlobRecorded(null);
        let startTime = Date.now();

        try {
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                });
            }

            setLiveStream(streamRef.current);

            const mimeType = getMimeType();
            const mediaRecorder = new MediaRecorder(streamRef.current);
            mediaRecordRef.current = mediaRecorder;

            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
                if (mediaRecorder.state === "inactive") {
                    void duration;
                    void startTime;

                    let blob = new Blob(chunksRef.current, { type: mimeType });
                    setBlobRecorded(blob);
                    onRecordingComplete(blob);
                    chunksRef.current = [];
                }
            });

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setLiveStream(null);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecordRef.current &&
            mediaRecordRef.current.state === "recording"
        ) {
            mediaRecordRef.current.stop();
            setDuration(0);
            setRecording(false);
            setLiveStream(null);
        }
    };

    const onRecordingComplete = (data: Blob) => {
        setAudioData(undefined);

        const blobUrl = URL.createObjectURL(data);
        const fileReader = new FileReader();

        fileReader.onloadend = async () => {
            const audioCTX = new AudioContext({
                sampleRate: 16000,
            });
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const decoded = await audioCTX.decodeAudioData(arrayBuffer);
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
        if (recording) {
            const timer = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [recording]);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    const handleRecorder = () => {
        if (recording) {
            stopRecording();
        } else {
            void startRecording();
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
            {recording || liveStream ? (
                <MicAudioVisualizer
                    stream={liveStream}
                    controlled
                    active={recording}
                    label="Your voice"
                    className="w-full"
                    canvasClassName="h-24"
                    barCount={36}
                />
            ) : null}

            <div className="flex flex-col items-center gap-2">
                <Button
                    type="button"
                    className="min-w-[10rem] font-medium"
                    size="lg"
                    variant={recording ? "default" : "outline"}
                    onClick={handleRecorder}
                >
                    {!recording ? "Start recording" : `Stop · ${duration}s`}
                </Button>
                {blobRecorded ? (
                    <p className="text-xs text-muted-foreground">
                        Recording ready · {Math.round(blobRecorded.size / 1024)} KB
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default SpeechToText;
