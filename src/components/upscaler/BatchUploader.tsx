"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { ScaleSelector } from "./ScaleSelector";
import { FormatSelector } from "./FormatSelector";
import type { Scale, OutputFormat } from "@/types/upscaler";

interface BatchFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "processing" | "complete" | "error";
  resultUrl?: string;
  error?: string;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp"];

interface BatchUploaderProps {
  scale: Scale;
  format: OutputFormat;
  quality: number;
  maxScale: Scale;
  maxFileSize: number;
  batchLimit: number;
  allowedFormats?: OutputFormat[];
  patchSize?: number;
  onScaleChange: (s: Scale) => void;
  onFormatChange: (f: OutputFormat) => void;
  onQualityChange: (q: number) => void;
}

export function BatchUploader({
  scale,
  format,
  quality,
  maxScale,
  maxFileSize,
  batchLimit,
  allowedFormats,
  patchSize = 32,
  onScaleChange,
  onFormatChange,
  onQualityChange,
}: BatchUploaderProps) {
  const t = useTranslations("upscaler");
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: BatchFile[] = [];
      for (const f of Array.from(fileList)) {
        if (!ACCEPTED_TYPES.includes(f.type)) continue;
        if (f.size > maxFileSize) continue;
        newFiles.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          file: f,
          progress: 0,
          status: "pending",
        });
      }

      setFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, batchLimit);
      });
    },
    [maxFileSize, batchLimit]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const processAll = useCallback(async () => {
    setIsProcessing(true);
    setAllDone(false);

    const [{ default: Upscaler }, tfjs, modelModule] = await Promise.all([
      import("upscaler"),
      import("@tensorflow/tfjs"),
      scale === 8 || scale === 4
        ? import("@upscalerjs/esrgan-slim/4x")
        : import("@upscalerjs/esrgan-slim/2x"),
    ]);
    await tfjs.ready();

    const upscaler = new Upscaler({ model: modelModule.default });

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: "processing", progress: 0 } : f
        )
      );

      try {
        const imageUrl = URL.createObjectURL(item.file);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load"));
          img.src = imageUrl;
        });

        let upscaledSrc: string;

        if (scale === 8) {
          // 4x first pass
          const firstPass = await upscaler.upscale(img, {
            output: "base64",
            patchSize: 128,
            padding: 2,
            progress: (p: number) =>
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id ? { ...f, progress: Math.round(p * 50) } : f
                )
              ),
          });

          const img2 = new Image();
          await new Promise<void>((resolve) => {
            img2.onload = () => resolve();
            img2.src = firstPass;
          });

          const model2x = await import("@upscalerjs/esrgan-slim/2x");
          const upscaler2 = new Upscaler({ model: model2x.default });
          upscaledSrc = await upscaler2.upscale(img2, {
            output: "base64",
            patchSize: 128,
            padding: 2,
            progress: (p: number) =>
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id
                    ? { ...f, progress: 50 + Math.round(p * 45) }
                    : f
                )
              ),
          });
          upscaler2.dispose();
        } else {
          upscaledSrc = await upscaler.upscale(img, {
            output: "base64",
            patchSize: 128,
            padding: 2,
            progress: (p: number) =>
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id ? { ...f, progress: Math.round(p * 95) } : f
                )
              ),
          });
        }

        URL.revokeObjectURL(imageUrl);

        // Convert to desired format
        const response = await fetch(upscaledSrc);
        const blob = await response.blob();

        let finalBlob: Blob;
        if (format !== "png") {
          const outputImg = new Image();
          await new Promise<void>((resolve) => {
            outputImg.onload = () => resolve();
            outputImg.src = upscaledSrc;
          });
          const canvas = document.createElement("canvas");
          canvas.width = outputImg.naturalWidth;
          canvas.height = outputImg.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(outputImg, 0, 0);
          finalBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
              (b) => resolve(b!),
              format === "jpeg" ? "image/jpeg" : "image/webp",
              quality / 100
            );
          });
        } else {
          finalBlob = blob;
        }

        const resultUrl = URL.createObjectURL(finalBlob);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "complete", progress: 100, resultUrl }
              : f
          )
        );

        // Record usage
        try {
          await fetch("/api/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              scale,
              inputWidth: img.naturalWidth,
              inputHeight: img.naturalHeight,
              outputWidth: img.naturalWidth * scale,
              outputHeight: img.naturalHeight * scale,
              inputFormat: item.file.name.split(".").pop() || "png",
              outputFormat: format,
              processingTime: 0,
            }),
          });
        } catch {
          // Non-critical
        }
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : "Failed",
                }
              : f
          )
        );
      }
    }

    upscaler.dispose();
    setIsProcessing(false);
    setAllDone(true);
  }, [files, scale, format, quality]);

  const downloadFile = useCallback((url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const downloadAll = useCallback(() => {
    files
      .filter((f) => f.status === "complete" && f.resultUrl)
      .forEach((f) => {
        downloadFile(f.resultUrl!, `upscaled_${f.file.name}`);
      });
  }, [files, downloadFile]);

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completeCount = files.filter((f) => f.status === "complete").length;

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="mb-3 block text-xs font-body uppercase tracking-widest text-muted">
            {t("scaleLabel")}
          </label>
          <ScaleSelector value={scale} onChange={onScaleChange} maxScale={maxScale} />
        </div>
        <div>
          <label className="mb-3 block text-xs font-body uppercase tracking-widest text-muted">
            {t("formatLabel")}
          </label>
          <FormatSelector value={format} onChange={onFormatChange} allowedFormats={allowedFormats} />
        </div>
        {(format === "jpeg" || format === "webp") && (
          <div>
            <label
              htmlFor="batch-quality"
              className="mb-3 block text-xs font-body uppercase tracking-widest text-muted"
            >
              {t("qualityLabel")}
              <span className="ms-2 font-mono normal-case tracking-normal text-ink">
                {quality}
              </span>
            </label>
            <input
              id="batch-quality"
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        )}
      </div>

      {/* Add files */}
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.bmp"
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="sr-only"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing || files.length >= batchLimit}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border border-border px-6 text-sm font-medium font-body text-ink transition-colors duration-200 ease-out hover:border-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("batchDescription")}
        </button>
        <span className="text-xs font-mono text-muted">
          {files.length}/{batchLimit}
        </span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-3">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 border border-border bg-surface p-4"
            >
              <span className="flex-1 truncate text-sm font-body text-ink">
                {item.file.name}
              </span>
              <span className="text-xs font-mono text-muted">
                {(item.file.size / 1024).toFixed(0)}KB
              </span>

              {item.status === "pending" && !isProcessing && (
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="cursor-pointer text-muted transition-colors duration-200 hover:text-ink"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </button>
              )}

              {item.status === "processing" && (
                <div className="flex items-center gap-2">
                  <div className="h-1 w-20 overflow-hidden bg-border">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-accent">{item.progress}%</span>
                </div>
              )}

              {item.status === "complete" && item.resultUrl && (
                <button
                  type="button"
                  onClick={() => downloadFile(item.resultUrl!, `upscaled_${item.file.name}`)}
                  className="cursor-pointer text-xs font-medium font-body text-accent transition-colors duration-200 hover:text-accent-hover"
                >
                  Download
                </button>
              )}

              {item.status === "error" && (
                <span className="text-xs font-body text-error">Error</span>
              )}

              {item.status === "pending" && isProcessing && (
                <span className="text-xs font-mono text-muted">Waiting</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {pendingCount > 0 && !isProcessing && (
          <button
            type="button"
            onClick={processAll}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm bg-accent px-8 text-sm font-medium font-body text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
          >
            {t("upscaleButton")} ({pendingCount})
          </button>
        )}

        {isProcessing && (
          <p className="flex items-center text-sm font-body text-muted">
            {t("processing")}
          </p>
        )}

        {allDone && completeCount > 0 && (
          <button
            type="button"
            onClick={downloadAll}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm bg-ink px-8 text-sm font-medium font-body text-paper transition-colors duration-200 ease-out hover:bg-accent"
          >
            {t("download")} ({completeCount})
          </button>
        )}
      </div>
    </div>
  );
}
