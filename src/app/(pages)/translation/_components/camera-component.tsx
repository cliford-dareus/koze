"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { LucideBlend, LucideCamera, LucideContrast } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { createWorker } from "tesseract.js";
import useImageProcessor from "@/app/hooks/useImageProcessor";

const CameraComponent = () => {
  const { preprocessImage } = useImageProcessor();
  const [open, setIsOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState("");
  const webcamRef = useRef<Webcam | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageContext, setImageContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [extractedData, setExtractedText] = useState("");
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
  }, [webcamRef]);

  const extractText = async () => {
    setTimeout(() => {
      if (!imageContext) return;
      imageContext.putImageData(preprocessImage(canvasRef.current, ""), 0, 0);
    }, 200);
    const dataUrl = canvasRef.current?.toDataURL("image/jpeg");

    try {
      const worker = await createWorker("eng");
      // await worker?.loadLanguage('eng');
      // await worker?.initialize('eng');
      const {
        data
      } = await worker.recognize(imageRef.current!);
      // setExtractedText(data);
      console.log(data);
      await worker.terminate();
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Error extracting text. Please try again.");
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;
    imageRef.current.onload = () => {
      console.log("LAODED");
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      setImageContext(ctx);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current!, 0, 0);
    };
  }, [imageCaptured]);

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
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
            <div className="relative w-full h-full bg-black rounded-md">
              <div className="absolute top-4 left-4 flex gap-4">
                <div className="rounded-full w-[30px] h-[30px] bg-slate-700 flex justify-center items-center">
                  <LucideContrast size={20} />
                </div>
                <div className="rounded-full w-[30px] h-[30px] bg-slate-700 flex justify-center items-center">
                  <LucideBlend size={20} />
                </div>
              </div>

              <canvas ref={canvasRef} className="w-full h-full hidden" />

              <Image
                className="w-full h-full object-contain"
                src={imageCaptured}
                alt=""
                width={370}
                height={720}
                ref={imageRef}
              />

              <div className="flex gap-4 justify-center items-center mt-4 rounded-full">
                <Button onClick={() => setImageCaptured("")}>Retake</Button>
                <Button
                  onClick={() => {
                    extractText();
                  }}
                >
                  Extract
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CameraComponent;
