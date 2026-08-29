/**
 * Image preprocessing helpers for Tesseract OCR.
 * Aggressive fixed thresholds destroy thin strokes; we use contrast stretch
 * and Otsu's method so phone photos of print stay readable.
 */
const useImageProcessor = () => {
  function getContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas context unavailable");
    return ctx;
  }

  function toGrayscale(data: Uint8ClampedArray) {
    for (let i = 0; i < data.length; i += 4) {
      const gray =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
  }

  /** Linear contrast stretch using percentiles to ignore outliers. */
  function contrastStretch(data: Uint8ClampedArray, lowPct = 2, highPct = 98) {
    const hist = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) hist[data[i]]++;

    const total = data.length / 4;
    let acc = 0;
    let lo = 0;
    let hi = 255;
    const lowCount = (lowPct / 100) * total;
    const highCount = (highPct / 100) * total;

    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (acc >= lowCount) {
        lo = v;
        break;
      }
    }
    acc = 0;
    for (let v = 255; v >= 0; v--) {
      acc += hist[v];
      if (acc >= total - highCount) {
        hi = v;
        break;
      }
    }
    if (hi <= lo) return;

    const scale = 255 / (hi - lo);
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.max(0, Math.min(255, Math.round((data[i] - lo) * scale)));
      data[i] = data[i + 1] = data[i + 2] = v;
    }
  }

  /** Otsu automatic threshold — better than a fixed 0.45 cutoff. */
  function otsuThreshold(data: Uint8ClampedArray) {
    const hist = new Array(256).fill(0);
    const total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) hist[data[i]]++;

    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * hist[t];

    let sumB = 0;
    let wB = 0;
    let maxVar = 0;
    let threshold = 128;

    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = total - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const between = wB * wF * (mB - mF) * (mB - mF);
      if (between > maxVar) {
        maxVar = between;
        threshold = t;
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      const v = data[i] >= threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = v;
    }
  }

  /**
   * mode:
   * - "enhance" — grayscale + contrast (good default for Tesseract)
   * - "binary"  — enhance then Otsu (helps some high-contrast print)
   */
  function preprocessImage(
    canvas: HTMLCanvasElement,
    mode: "enhance" | "binary" = "enhance",
  ): ImageData {
    const ctx = getContext(canvas);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    toGrayscale(image.data);
    contrastStretch(image.data);
    if (mode === "binary") {
      otsuThreshold(image.data);
    }
    return image;
  }

  /** Draw source onto a possibly upscaled canvas for clearer glyph edges. */
  function prepareCanvasFromImage(
    img: HTMLImageElement,
    minWidth = 1200,
  ): HTMLCanvasElement {
    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    const scale = srcW < minWidth ? minWidth / srcW : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(srcW * scale);
    canvas.height = Math.round(srcH * scale);
    const ctx = getContext(canvas);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  return { preprocessImage, prepareCanvasFromImage };
};

export default useImageProcessor;
