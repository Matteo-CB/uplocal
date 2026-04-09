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

// ─── Global caches: persist across hook instances and re-renders ───
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
  // Try WebGL first (GPU), fall back to WASM or CPU
  const currentBackend = tf.getBackend();
  if (currentBackend !== "webgl") {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
    } catch {
      // Stay on whatever backend is available
    }
  }
  // Warm up the WebGL context with a tiny tensor op
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
    const modelModule =
      modelKey === "4x"
        ? await import("@upscalerjs/esrgan-slim/4x")
        : await import("@upscalerjs/esrgan-slim/2x");
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

  // Warm up TF.js backend as soon as the hook mounts (while user is idle)
  useEffect(() => {
    ensureBackend();
  }, []);

  // Preload a model in the background (call when user drops an image)
  const preloadModel = useCallback(async (scale: Scale) => {
    try {
      await ensureBackend();
      const key = scale === 2 ? "2x" : "4x";
      await ensureUpscaler(key as "2x" | "4x");
      if (scale === 8) await ensureUpscaler("2x");
    } catch {
      // Non-critical, model will load at upscale time
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
        // ─── 1. Ensure backend + model ready ───
        await ensureBackend();
        setProgress(5);

        const modelKey: "2x" | "4x" = scale === 2 ? "2x" : "4x";
        const upscaler = await ensureUpscaler(modelKey);
        if (scale === 8) await ensureUpscaler("2x");

        setProgress(15);
        setState("processing");

        // ─── 2. Decode image directly via createImageBitmap (off main thread) ───
        const bitmap = await createImageBitmap(file);
        const inputWidth = bitmap.width;
        const inputHeight = bitmap.height;

        // Draw to a canvas. UpscalerJS accepts canvas elements directly
        // via tf.browser.fromPixels internally. No need for toDataURL.
        const srcCanvas = document.createElement("canvas");
        srcCanvas.width = inputWidth;
        srcCanvas.height = inputHeight;
        const srcCtx = srcCanvas.getContext("2d")!;
        srcCtx.drawImage(bitmap, 0, 0);
        bitmap.close();

        // Create an img from the canvas for UpscalerJS
        // Use toBlob (async, non-blocking) instead of toDataURL (sync, blocking)
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

        // ─── 3. Upscale with large patchSize for speed ───
        // patchSize 128 = fewer tiles = less overhead. padding 2 is sufficient.
        const patchSize = 128;
        const padding = 2;

        let upscaledSrc: string;

        if (scale === 8) {
          // Pass 1: 4x
          const firstPass = await upscaler.upscale(img, {
            output: "base64",
            patchSize,
            padding,
            progress: (p: number) => {
              if (!abortRef.current) setProgress(20 + Math.round(p * 35));
            },
          });

          if (abortRef.current) { URL.revokeObjectURL(srcUrl); return; }

          // Pass 2: 2x on the 4x result
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

        // ─── 4. Convert result to final format ───
        // Decode the base64 result into a canvas for format conversion
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
          outCanvas.width = customWidth;
          outCanvas.height = customHeight;
          const ctx = outCanvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(outImg, 0, 0, customWidth, customHeight);
          finalWidth = customWidth;
          finalHeight = customHeight;
        } else {
          outCanvas.width = finalWidth;
          outCanvas.height = finalHeight;
          outCanvas.getContext("2d")!.drawImage(outImg, 0, 0);
        }

        setProgress(96);

        // Use toBlob (async) for final encoding, faster than toDataURL
        const mimeType =
          outputFormat === "jpeg" ? "image/jpeg"
            : outputFormat === "webp" ? "image/webp"
              : "image/png";

        const finalBlob = await new Promise<Blob>((resolve) => {
          outCanvas.toBlob((b) => resolve(b!), mimeType, quality / 100);
        });

        const finalUrl = URL.createObjectURL(finalBlob);
        const processingTimeMs = Math.round(performance.now() - startTime);

        // Free canvases
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
