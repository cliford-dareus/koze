const useImageProcessor = () => {
  /**
   * Preprocess canvas image data for better OCR accuracy.
   * Applies grayscale + adaptive-style threshold (optional invert for dark text on light bg is skipped by default).
   */
  function preprocessImage(
    canvas: HTMLCanvasElement,
    type: string = "threshold",
  ): ImageData {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context unavailable");
    }

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (type === "invert") {
      invertColors(image.data);
    }

    // Always convert to high-contrast binary for Tesseract
    thresholdFilter(image.data, 0.45);

    return image;
  }

  function thresholdFilter(pixels: Uint8ClampedArray, level: number = 0.5) {
    const thresh = Math.floor(level * 255);
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];

      const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      const value = gray >= thresh ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
    }
  }

  function invertColors(pixels: Uint8ClampedArray) {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i] ^ 255;
      pixels[i + 1] = pixels[i + 1] ^ 255;
      pixels[i + 2] = pixels[i + 2] ^ 255;
    }
  }

  return { preprocessImage };
};

export default useImageProcessor;
