"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LucideCamera } from "lucide-react";
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const [imageCaptured, setImageCaptured] = useState("");
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOptions, setCameraOptions] = useState({
    facingMode: "user",
    width: 1280,
    height: 720,
  });

  const capture = useCallback(() => {
    const imageSrc = (webcamRef.current as Webcam).getScreenshot();
    setImageCaptured(
      "https://images.pexels.com/photos/1228483/pexels-photo-1228483.jpeg",
    );

    if (!canvasRef.current) {
      const canvas = canvasRef.current!;
    }
  }, [webcamRef]);

  useEffect(() => {
    if (canvasRef.current) {
    }
  }, []);

  return (
    <Drawer>
      <DrawerTrigger className="">
        <LucideCamera size={20} />
      </DrawerTrigger>
      <DrawerContent className="bg-primary-gradient border-none p-2 h-[90%]">
        <DrawerTitle className="text-center">Camera</DrawerTitle>
        <DrawerDescription></DrawerDescription>

        <div className="max-h-[80vh] h-[70vh] mt-4">
          {!imageCaptured ? (
            <>
              <Webcam
                className="h-full"
                allowFullScreen={true}
                audio={false}
                height={720}
                width={1280}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={cameraOptions}
              />
              <Button onClick={capture}>Capture</Button>
            </>
          ) : (
            <div className="relative w-full h-full">
              <div className="absolute">
                <div>B/W</div>
              </div>

              <canvas ref={canvasRef} />

              <div className="flex gap-4 justify-center items-center mt-4 rounded-full">
                <Button onClick={() => setImageCaptured("")}>Retake</Button>
                <Button>Extract</Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CameraComponent;
