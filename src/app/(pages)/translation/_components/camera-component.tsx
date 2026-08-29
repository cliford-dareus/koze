"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { LucideCamera, LucideSwitchCamera } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { createWorker } from "tesseract.js";
import useImageProcessor from "@/app/hooks/useImageProcessor";

type Props = {
  setTextToTranslate: Dispatch<SetStateAction<string>>;
};

const CameraComponent = ({ setTextToTranslate }: Props) => {
  const { preprocessImage } = useImageProcessor();
  const [open, setIsOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const webcamRef = useRef<Webcam | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const videoConstraints = {
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const capture = useCallback(() => {
    setError("");
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture image. Please try again.");
      return;
    }
    setImageCaptured(imageSrc);
  }, []);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  const extractText = async () => {
    if (!canvasRef.current || !imageRef.current) {
      setError("Image not ready. Please retake the photo.");
      return;
    }

    setIsExtracting(true);
    setError("");

    try {
      const canvas = canvasRef.current;
      const img = imageRef.current;

      // Ensure canvas matches the natural image size for better OCR
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Preprocess for OCR (grayscale + threshold)
      const processed = preprocessImage(canvas, "threshold");
      ctx.putImageData(processed, 0, 0);

      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(canvas);
      await worker.terminate();

      const cleaned = text?.trim() ?? "";
      if (!cleaned) {
        setError("No text found in the image. Try better lighting or a clearer photo.");
        setIsExtracting(false);
        return;
      }

      setTextToTranslate(cleaned);
      setImageCaptured("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error extracting text:", err);
      setError("Error extracting text. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Draw image onto canvas when a capture is set
  useEffect(() => {
    if (!imageCaptured || !imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;

    const draw = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }
  }, [imageCaptured]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      setImageCaptured("");
      setError("");
      setIsExtracting(false);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerTrigger className="" type="button">
        <LucideCamera size={20} />
      </DrawerTrigger>
      <DrawerContent className="bg-primary-gradient border-none p-2 h-[90%]">
        <DrawerTitle className="text-center">Scan text</DrawerTitle>
        <DrawerDescription className="text-center text-slate-300 text-sm">
          Point at text, capture, then extract to translate
        </DrawerDescription>

        <div className="max-h-[80vh] h-[70vh] mt-4 flex flex-col">
          {!imageCaptured ? (
            <>
              <div className="relative flex-1 min-h-0 rounded-md overflow-hidden bg-black">
                <Webcam
                  className="h-full w-full object-cover"
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.92}
                  videoConstraints={videoConstraints}
                  mirrored={facingMode === "user"}
                />
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="absolute top-3 right-3 rounded-full w-10 h-10 bg-slate-800/80 flex items-center justify-center"
                  aria-label="Switch camera"
                >
                  <LucideSwitchCamera size={20} />
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center mt-2">{error}</p>
              )}
              <div className="flex justify-center mt-4">
                <Button type="button" onClick={capture} className="font-bold px-8">
                  Capture
                </Button>
              </div>
            </>
          ) : (
            <div className="relative flex-1 min-h-0 flex flex-col">
              <div className="relative flex-1 min-h-0 bg-black rounded-md overflow-hidden">
                {/* Hidden canvas used for preprocessing + OCR */}
                <canvas ref={canvasRef} className="hidden" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  className="w-full h-full object-contain"
                  src={imageCaptured}
                  alt="Captured for OCR"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mt-2">{error}</p>
              )}

              <div className="flex gap-4 justify-center items-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setImageCaptured("");
                    setError("");
                  }}
                  disabled={isExtracting}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  onClick={extractText}
                  disabled={isExtracting}
                  className="font-bold"
                >
                  {isExtracting ? "Extracting…" : "Extract text"}
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
