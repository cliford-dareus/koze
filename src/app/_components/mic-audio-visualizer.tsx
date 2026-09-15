"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LucideMic, LucideMicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/_components/ui/button";

type Props = {
  /** When true, starts the mic automatically (e.g. while recording elsewhere). */
  active?: boolean;
  /** Hide the built-in start/stop control (parent drives `active`). */
  controlled?: boolean;
  className?: string;
  canvasClassName?: string;
  barCount?: number;
  label?: string;
  /** Optional external MediaStream — skips getUserMedia when provided. */
  stream?: MediaStream | null;
  onListeningChange?: (listening: boolean) => void;
};

/**
 * Frequency-bar visualizer driven by the microphone (or an injected stream).
 * Uses AnalyserNode + requestAnimationFrame; cleans up tracks on stop/unmount.
 */
export default function MicAudioVisualizer({
  active,
  controlled = false,
  className,
  canvasClassName,
  barCount = 32,
  label = "Mic visualizer",
  stream: externalStream = null,
  onListeningChange,
}: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const ownedStreamRef = useRef<MediaStream | null>(null);
  const smoothBarsRef = useRef<number[]>([]);

  const stopInternal = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      sourceRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    sourceRef.current = null;
    analyserRef.current = null;

    if (ownedStreamRef.current) {
      ownedStreamRef.current.getTracks().forEach((t) => t.stop());
      ownedStreamRef.current = null;
    }

    if (ctxRef.current && ctxRef.current.state !== "closed") {
      void ctxRef.current.close();
    }
    ctxRef.current = null;

    setListening(false);
    setLevel(0);
    onListeningChange?.(false);

    const canvas = canvasRef.current;
    const g = canvas?.getContext("2d");
    if (canvas && g) {
      g.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [onListeningChange]);

  const drawFrame = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const g = canvas.getContext("2d");
    if (!g) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const cssW = canvas.clientWidth || 320;
    const cssH = canvas.clientHeight || 80;
    if (canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr)) {
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);

    const bars = barCount;
    if (smoothBarsRef.current.length !== bars) {
      smoothBarsRef.current = new Array(bars).fill(0);
    }

    // Sample across the useful lower-mid spectrum
    const usable = Math.floor(bufferLength * 0.55);
    const step = Math.max(1, Math.floor(usable / bars));
    let sum = 0;

    for (let i = 0; i < bars; i++) {
      let peak = 0;
      const start = i * step;
      for (let j = 0; j < step; j++) {
        peak = Math.max(peak, data[start + j] ?? 0);
      }
      const target = peak / 255;
      const prev = smoothBarsRef.current[i] ?? 0;
      const next = prev * 0.72 + target * 0.28;
      smoothBarsRef.current[i] = next;
      sum += next;
    }
    setLevel(sum / bars);

    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim() || "170 28% 23%";
    const muted = styles.getPropertyValue("--muted").trim() || "40 16% 90%";
    const foreground = styles.getPropertyValue("--foreground").trim() || "40 8% 10%";

    g.clearRect(0, 0, cssW, cssH);

    // Soft base rail
    g.fillStyle = `hsl(${muted} / 0.55)`;
    g.fillRect(0, cssH * 0.5 - 1, cssW, 2);

    const gap = 3;
    const totalGap = gap * (bars - 1);
    const barW = Math.max(2, (cssW - totalGap) / bars);
    const maxH = cssH * 0.92;

    for (let i = 0; i < bars; i++) {
      const v = smoothBarsRef.current[i] ?? 0;
      const h = Math.max(3, v * maxH);
      const x = i * (barW + gap);
      const y = (cssH - h) / 2;

      const alpha = 0.35 + v * 0.65;
      g.fillStyle = `hsl(${primary} / ${alpha})`;

      const radius = Math.min(4, barW / 2);
      roundRect(g, x, y, barW, h, radius);
      g.fill();

      // Subtle highlight
      g.fillStyle = `hsl(${foreground} / ${0.08 + v * 0.12})`;
      roundRect(g, x, y, barW, Math.max(2, h * 0.18), radius);
      g.fill();
    }

    rafRef.current = requestAnimationFrame(drawFrame);
  }, [barCount]);

  const startWithStream = useCallback(
    async (media: MediaStream, ownsStream: boolean) => {
      stopInternal();
      setError(null);

      if (ownsStream) {
        ownedStreamRef.current = media;
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(media);
      sourceRef.current = source;
      source.connect(analyser);
      // Do not connect to destination — avoid feedback/echo

      setListening(true);
      onListeningChange?.(true);
      rafRef.current = requestAnimationFrame(drawFrame);
    },
    [drawFrame, onListeningChange, stopInternal],
  );

  const startMic = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      await startWithStream(media, true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Microphone permission denied."
          : "Could not access the microphone.",
      );
      setListening(false);
      onListeningChange?.(false);
    }
  }, [onListeningChange, startWithStream]);

  // Controlled / external stream
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (externalStream) {
        if (!cancelled) await startWithStream(externalStream, false);
        return;
      }
      if (controlled) {
        if (active) {
          if (!cancelled) await startMic();
        } else {
          stopInternal();
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, controlled, externalStream]);

  useEffect(() => {
    return () => stopInternal();
  }, [stopInternal]);

  const toggle = () => {
    if (listening) stopInternal();
    else void startMic();
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {listening
              ? level > 0.08
                ? "Hearing you…"
                : "Listening — try speaking"
              : "Tap to react to your voice"}
          </p>
        </div>
        {!controlled && !externalStream ? (
          <Button
            type="button"
            size="sm"
            variant={listening ? "default" : "outline"}
            onClick={toggle}
            className="shrink-0 gap-1.5"
            aria-pressed={listening}
          >
            {listening ? (
              <>
                <LucideMicOff size={14} strokeWidth={1.75} />
                Stop
              </>
            ) : (
              <>
                <LucideMic size={14} strokeWidth={1.75} />
                Mic
              </>
            )}
          </Button>
        ) : null}
        {(controlled || externalStream) && listening ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Live
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "relative h-20 w-full overflow-hidden rounded-lg bg-muted/40",
          canvasClassName,
        )}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          role="img"
          aria-label={listening ? "Live microphone levels" : "Microphone visualizer idle"}
        />
        {!listening && !error ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-8 items-end gap-1 opacity-30">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-primary"
                  style={{
                    height: `${20 + Math.sin(i * 0.9) * 12}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + radius, y);
  g.arcTo(x + w, y, x + w, y + h, radius);
  g.arcTo(x + w, y + h, x, y + h, radius);
  g.arcTo(x, y + h, x, y, radius);
  g.arcTo(x, y, x + w, y, radius);
  g.closePath();
}
