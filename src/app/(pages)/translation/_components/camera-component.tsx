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
import { createWorker, type Worker } from "tesseract.js";
import useImageProcessor from "@/app/hooks/useImageProcessor";

type Props = {
  setTextToTranslate: Dispatch<SetStateAction<string>>;
};

function cleanOcrText(raw: string) {
  return raw
    .replace(/[|]/g, "I")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function recognizeCanvas(canvas: HTMLCanvasElement) {
  let worker: Worker | null = null;
  try {
    // eng + fra + spa covers the app's supported languages
    worker = await createWorker(["eng", "fra", "spa"], 1, {
      logger: () => {},
    });

    // Assume a uniform block of text (typical for a document / sign photo)
    await worker.setParameters({
      tessedit_pageseg_mode: "6" as unknown as undefined,
      preserve_interword_spaces: "1",
    });

    const {
      data: { text, confidence },
    } = await worker.recognize(canvas);

    return {
      text: cleanOcrText(text ?? ""),
      confidence: typeof confidence === "number" ? confidence : 0,
    };
  } finally {
    if (worker) await worker.terminate();
  }
}

const CameraComponent = ({ setTextToTranslate }: Props) => {
  const { preprocessImage, prepareCanvasFromImage } = useImageProcessor();
  const [open, setIsOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );

  const webcamRef = useRef<Webcam | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  const capture = useCallback(() => {
    setError("");
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1920,
      height: 1080,
    });
    if (!imageSrc) {
      setError("Could not capture image. Please try again.");
      return;
    }
    setImageCaptured(imageSrc);
  }, []);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  const waitForImage = (img: HTMLImageElement) =>
    new Promise<void>((resolve, reject) => {
      if (img.complete && img.naturalWidth > 0) {
        resolve();
        return;
      }
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Image failed to load"));
      };
      const cleanup = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    });

  const extractText = async () => {
    if (!imageRef.current) {
      setError("Image not ready. Please retake the photo.");
      return;
    }

    setIsExtracting(true);
    setError("");

    try {
      const img = imageRef.current;
      await waitForImage(img);

      // Upscale small captures so glyph edges are clearer for Tesseract
      const baseCanvas = prepareCanvasFromImage(img, 1400);
      const ctx = baseCanvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get canvas context");

      // Pass 1: contrast-enhanced grayscale (usually best)
      const enhanced = preprocessImage(baseCanvas, "enhance");
      ctx.putImageData(enhanced, 0, 0);
      const pass1 = await recognizeCanvas(baseCanvas);

      // Pass 2: Otsu binary — only keep if clearly better
      ctx.putImageData(enhanced, 0, 0);
      const binary = preprocessImage(baseCanvas, "binary");
      ctx.putImageData(binary, 0, 0);
      const pass2 = await recognizeCanvas(baseCanvas);

      const best =
        pass2.confidence > pass1.confidence + 5 && pass2.text.length > 0
          ? pass2
          : pass1.text.length >= pass2.text.length
            ? pass1
            : pass2;

      if (!best.text) {
        setError(
          "No text found. Try brighter light, fill the frame with the text, and hold steady.",
        );
        return;
      }

      // Very low confidence usually means noise / wrong region
      if (best.confidence > 0 && best.confidence < 35) {
        setError(
          "Text was hard to read. Move closer, reduce glare, and try again.",
        );
        // Still fill the field so the user can edit
        setTextToTranslate(best.text);
        return;
      }

      setTextToTranslate(best.text);
      setImageCaptured("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error extracting text:", err);
      setError("Error extracting text. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

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
      <DrawerContent className="h-[90%] border-border bg-background p-2">
        <DrawerTitle className="text-center font-display text-lg">
          Scan text
        </DrawerTitle>
        <DrawerDescription className="text-center text-sm text-muted-foreground">
          Fill the frame with the text, avoid glare, then extract
        </DrawerDescription>

        <div className="mt-4 flex h-[70vh] max-h-[80vh] flex-col">
          {!imageCaptured ? (
            <>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-black">
                <Webcam
                  className="h-full w-full object-cover"
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.95}
                  forceScreenshotSourceSize
                  videoConstraints={videoConstraints}
                  mirrored={facingMode === "user"}
                />
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label="Switch camera"
                >
                  <LucideSwitchCamera size={20} />
                </button>
              </div>
              {error && (
                <p className="mt-2 text-center text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="mt-4 flex justify-center">
                <Button type="button" onClick={capture} className="px-8">
                  Capture
                </Button>
              </div>
            </>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  className="h-full w-full object-contain"
                  src={imageCaptured}
                  alt="Captured for OCR"
                />
              </div>

              {error && (
                <p className="mt-2 text-center text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-4">
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
