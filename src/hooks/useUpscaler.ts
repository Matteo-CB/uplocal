"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Scale, OutputFormat } from "@/types/upscaler";

export type UpscalerState =
  | "idle"
  | "loading-model"
  | "processing"
  | "complete"
  | "error";

export interface UpscaleResult {
  imageUrl: string;
  stats: {
    inputWidth: number;
    inputHeight: number;
    outputWidth: number;
    outputHeight: number;
    processingTimeMs: number;
  };
}

interface UpscaleOptions {
  scale?: Scale;
  outputFormat?: OutputFormat;
  quality?: number;
  tileSize?: number;
  tileOverlap?: number;
  customWidth?: number;
  customHeight?: number;
}

// ─── Global caches ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let UpscalerClass: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upscalerInstances: Record<string, any> = {};
let backendReady = false;

async function ensureBackend() {
  if (backendReady) return;
  if (!tf) {
    tf = await import("@tensorflow/tfjs");
  }
  await tf.ready();
  const currentBackend = tf.getBackend();
  if (currentBackend !== "webgl") {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
    } catch {
      // Stay on whatever backend is available
    }
  }
  // Warm up WebGL
  const warmup = tf.zeros([1, 1, 1]);
  warmup.dispose();
  backendReady = true;
}

async function ensureUpscaler(modelKey: "2x" | "4x") {
  if (!UpscalerClass) {
    const mod = await import("upscaler");
    UpscalerClass = mod.default;
  }
  if (!upscalerInstances[modelKey]) {
    // Use esrgan-medium for much better quality (vs esrgan-slim)
    const modelModule =
      modelKey === "4x"
        ? await import("@upscalerjs/esrgan-medium/4x")
        : await import("@upscalerjs/esrgan-medium/2x");
    upscalerInstances[modelKey] = new UpscalerClass({
      model: modelModule.default,
    });
  }
  return upscalerInstances[modelKey];
}

// ─── Hook ───
export function useUpscaler() {
  const [state, setState] = useState<UpscalerState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UpscaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  // Warm up TF.js backend immediately
  useEffect(() => {
    ensureBackend();
  }, []);

  const preloadModel = useCallback(async (scale: Scale) => {
    try {
      await ensureBackend();
      const key = scale === 2 ? "2x" : "4x";
      await ensureUpscaler(key as "2x" | "4x");
      if (scale === 8) await ensureUpscaler("2x");
    } catch {
      // Non-critical
    }
  }, []);

  const upscale = useCallback(
    async (file: File, options: UpscaleOptions = {}) => {
      const scale = options.scale || 2;
      const outputFormat = options.outputFormat || "png";
      const quality = options.quality || 90;
      const customWidth = options.customWidth;
      const customHeight = options.customHeight;
      abortRef.current = false;

      setState("loading-model");
      setProgress(0);
      setResult(null);
      setError(null);

      try {
        // ─── 1. Backend + model ───
        await ensureBackend();
        setProgress(5);

        const modelKey: "2x" | "4x" = scale === 2 ? "2x" : "4x";
        const upscaler = await ensureUpscaler(modelKey);
        if (scale === 8) await ensureUpscaler("2x");

        setProgress(15);
        setState("processing");

        // ─── 2. Decode image preserving transparency ───
        const bitmap = await createImageBitmap(file);
        const inputWidth = bitmap.width;
        const inputHeight = bitmap.height;

        // Detect if image has alpha channel
        const detectCanvas = document.createElement("canvas");
        detectCanvas.width = inputWidth;
        detectCanvas.height = inputHeight;
        const detectCtx = detectCanvas.getContext("2d", { willReadFrequently: true })!;
        detectCtx.drawImage(bitmap, 0, 0);
        const pixelData = detectCtx.getImageData(0, 0, inputWidth, inputHeight);
        let hasAlpha = false;
        for (let i = 3; i < pixelData.data.length; i += 4) {
          if (pixelData.data[i] < 255) {
            hasAlpha = true;
            break;
          }
        }
        detectCanvas.width = 0;
        detectCanvas.height = 0;

        // Create source canvas (white background for AI, preserving original for alpha compositing later)
        const srcCanvas = document.createElement("canvas");
        srcCanvas.width = inputWidth;
        srcCanvas.height = inputHeight;
        const srcCtx = srcCanvas.getContext("2d")!;

        // For AI processing: fill white background (avoids black artifacts)
        srcCtx.fillStyle = "#ffffff";
        srcCtx.fillRect(0, 0, inputWidth, inputHeight);
        srcCtx.drawImage(bitmap, 0, 0);
        bitmap.close();

        // Create img element for UpscalerJS
        const srcBlob = await new Promise<Blob>((resolve) => {
          srcCanvas.toBlob((b) => resolve(b!), "image/png");
        });
        const srcUrl = URL.createObjectURL(srcBlob);
        const img = new Image();
        img.src = srcUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });

        const startTime = performance.now();
        setProgress(20);
        if (abortRef.current) { URL.revokeObjectURL(srcUrl); return; }

        // ─── 3. Upscale ───
        const patchSize = 64;
        const padding = 4;

        let upscaledSrc: string;

        if (scale === 8) {
          const firstPass = await upscaler.upscale(img, {
            output: "base64",
            patchSize,
            padding,
            progress: (p: number) => {
              if (!abortRef.current) setProgress(20 + Math.round(p * 35));
            },
          });

          if (abortRef.current) { URL.revokeObjectURL(srcUrl); return; }

          const img2 = new Image();
          img2.src = firstPass;
          await new Promise<void>((r) => { img2.onload = () => r(); });

          upscaledSrc = await upscalerInstances["2x"].upscale(img2, {
            output: "base64",
            patchSize,
            padding,
            progress: (p: number) => {
              if (!abortRef.current) setProgress(55 + Math.round(p * 35));
            },
          });
        } else {
          upscaledSrc = await upscaler.upscale(img, {
            output: "base64",
            patchSize,
            padding,
            progress: (p: number) => {
              if (!abortRef.current) setProgress(20 + Math.round(p * 70));
            },
          });
        }

        URL.revokeObjectURL(srcUrl);
        if (abortRef.current) return;
        setProgress(92);

        // ─── 4. Reconstruct with alpha if needed ───
        const outImg = new Image();
        outImg.src = upscaledSrc;
        await new Promise<void>((r) => { outImg.onload = () => r(); });

        let finalWidth = outImg.naturalWidth;
        let finalHeight = outImg.naturalHeight;

        const outCanvas = document.createElement("canvas");
        const needsResize =
          customWidth && customHeight &&
          (customWidth !== finalWidth || customHeight !== finalHeight);

        if (needsResize) {
          finalWidth = customWidth;
          finalHeight = customHeight;
        }

        outCanvas.width = finalWidth;
        outCanvas.height = finalHeight;
        const outCtx = outCanvas.getContext("2d")!;

        if (hasAlpha) {
          // Upscale the alpha channel: scale the original alpha mask
          const alphaCanvas = document.createElement("canvas");
          alphaCanvas.width = finalWidth;
          alphaCanvas.height = finalHeight;
          const alphaCtx = alphaCanvas.getContext("2d", { willReadFrequently: true })!;

          // Draw original image scaled up (nearest neighbor for alpha mask)
          alphaCtx.imageSmoothingEnabled = true;
          alphaCtx.imageSmoothingQuality = "high";
          alphaCtx.drawImage(
            detectCtx.canvas.width === 0
              ? (() => {
                  // Re-create detect canvas since we cleared it
                  const c = document.createElement("canvas");
                  c.width = inputWidth;
                  c.height = inputHeight;
                  const cx = c.getContext("2d")!;
                  cx.putImageData(pixelData, 0, 0);
                  return c;
                })()
              : detectCanvas,
            0, 0, inputWidth, inputHeight,
            0, 0, finalWidth, finalHeight
          );

          // Actually, let's just re-create from pixelData
          const alphaSource = document.createElement("canvas");
          alphaSource.width = inputWidth;
          alphaSource.height = inputHeight;
          alphaSource.getContext("2d")!.putImageData(pixelData, 0, 0);

          alphaCtx.clearRect(0, 0, finalWidth, finalHeight);
          alphaCtx.imageSmoothingEnabled = true;
          alphaCtx.imageSmoothingQuality = "high";
          alphaCtx.drawImage(alphaSource, 0, 0, finalWidth, finalHeight);

          const scaledAlpha = alphaCtx.getImageData(0, 0, finalWidth, finalHeight);

          // Draw the upscaled RGB
          if (needsResize) {
            outCtx.imageSmoothingEnabled = true;
            outCtx.imageSmoothingQuality = "high";
            outCtx.drawImage(outImg, 0, 0, finalWidth, finalHeight);
          } else {
            outCtx.drawImage(outImg, 0, 0);
          }

          // Apply original alpha channel onto upscaled result
          const finalPixels = outCtx.getImageData(0, 0, finalWidth, finalHeight);
          for (let i = 3; i < finalPixels.data.length; i += 4) {
            finalPixels.data[i] = scaledAlpha.data[i];
          }
          outCtx.putImageData(finalPixels, 0, 0);

          alphaCanvas.width = 0;
          alphaCanvas.height = 0;
          alphaSource.width = 0;
          alphaSource.height = 0;
        } else {
          // No alpha: just draw normally
          if (needsResize) {
            outCtx.imageSmoothingEnabled = true;
            outCtx.imageSmoothingQuality = "high";
            outCtx.drawImage(outImg, 0, 0, finalWidth, finalHeight);
          } else {
            outCtx.drawImage(outImg, 0, 0);
          }
        }

        setProgress(96);

        // ─── 5. Encode to final format ───
        const mimeType =
          outputFormat === "jpeg" ? "image/jpeg"
            : outputFormat === "webp" ? "image/webp"
              : "image/png";

        const finalBlob = await new Promise<Blob>((resolve) => {
          outCanvas.toBlob((b) => resolve(b!), mimeType, quality / 100);
        });

        const finalUrl = URL.createObjectURL(finalBlob);
        const processingTimeMs = Math.round(performance.now() - startTime);

        // Cleanup
        srcCanvas.width = 0;
        srcCanvas.height = 0;
        outCanvas.width = 0;
        outCanvas.height = 0;

        setResult({
          imageUrl: finalUrl,
          stats: { inputWidth, inputHeight, outputWidth: finalWidth, outputHeight: finalHeight, processingTimeMs },
        });
        setState("complete");
        setProgress(100);
      } catch (err) {
        if (abortRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to process image");
        setState("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    if (result?.imageUrl) URL.revokeObjectURL(result.imageUrl);
    setState("idle");
    setProgress(0);
    setResult(null);
    setError(null);
  }, [result]);

  const downloadResult = useCallback(
    (filename?: string) => {
      if (!result?.imageUrl) return;
      const a = document.createElement("a");
      a.href = result.imageUrl;
      a.download = filename || "upscaled-image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [result]
  );

  return { state, progress, result, error, upscale, reset, downloadResult, preloadModel };
}
