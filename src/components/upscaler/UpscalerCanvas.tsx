"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useUpscaler } from "@/hooks/useUpscaler";
import { useUsage } from "@/hooks/useUsage";
import { DropZone } from "./DropZone";
import { ScaleSelector } from "./ScaleSelector";
import { FormatSelector } from "./FormatSelector";
import { ProcessingBar } from "./ProcessingBar";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { OutputPreview } from "./OutputPreview";
import { DownloadButton } from "./DownloadButton";
import { BatchUploader } from "./BatchUploader";
import { CustomDimensions } from "./CustomDimensions";
import { Link } from "@/lib/i18n/navigation";
import type { Scale, OutputFormat } from "@/types/upscaler";

export function UpscalerCanvas() {
  const t = useTranslations("upscaler");
  const { state, progress, result, error, upscale, reset, preloadModel } =
    useUpscaler();
  const { status, loading: usageLoading, checkBeforeUpscale, recordUpscale } =
    useUsage();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<Scale>(2);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [customWidth, setCustomWidth] = useState(0);
  const [customHeight, setCustomHeight] = useState(0);
  const [inputDims, setInputDims] = useState({ w: 0, h: 0 });
  const hasRecorded = useRef(false);

  const maxScale = (status?.maxScale || 2) as Scale;
  const maxFileSize = status?.maxFileSize || 5 * 1024 * 1024;
  const batchLimit = status?.batchLimit || 1;
  const canBatch = batchLimit > 1;
  const allowedFormats = status?.allowedFormats || ["png", "jpeg"];
  const canCustomDimensions = status?.customDimensions || false;
  const patchSize = status?.patchSize || 32;

  // Record usage when upscale completes
  useEffect(() => {
    if (state === "complete" && result && !hasRecorded.current) {
      hasRecorded.current = true;
      const ext = file?.name?.split(".").pop() || "png";
      recordUpscale({
        scale,
        inputWidth: result.stats.inputWidth,
        inputHeight: result.stats.inputHeight,
        outputWidth: result.stats.outputWidth,
        outputHeight: result.stats.outputHeight,
        inputFormat: ext,
        outputFormat: format,
        processingTime: result.stats.processingTimeMs,
      });
    }
  }, [state, result, scale, format, file, recordUpscale]);

  // Reset format to png if current format is not allowed
  useEffect(() => {
    if (!allowedFormats.includes(format)) {
      setFormat("png");
    }
  }, [allowedFormats, format]);

  // Preload model when scale changes while image is loaded
  useEffect(() => {
    if (imageLoaded) {
      preloadModel(scale);
    }
  }, [scale, imageLoaded, preloadModel]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setImageLoaded(true);
    setLimitError(null);

    // Preload the AI model in background while user picks options
    preloadModel(scale);

    // Get input dimensions
    const img = new Image();
    img.onload = () => {
      setInputDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = URL.createObjectURL(selectedFile);
  }, [scale, preloadModel]);

  const handleUpscale = useCallback(async () => {
    if (!file) return;
    setLimitError(null);

    const freshStatus = await checkBeforeUpscale();
    if (freshStatus && !freshStatus.canUpscale) {
      setLimitError(t("freeLimit"));
      return;
    }
    if (freshStatus && scale > freshStatus.maxScale) {
      setLimitError(t("upgradePrompt"));
      return;
    }

    hasRecorded.current = false;
    upscale(file, {
      scale,
      outputFormat: format,
      quality,
      tileSize: patchSize === 64 ? 512 : 256,
      tileOverlap: 32,
      customWidth: canCustomDimensions && customWidth > 0 ? customWidth : undefined,
      customHeight: canCustomDimensions && customHeight > 0 ? customHeight : undefined,
    });
  }, [file, scale, format, quality, patchSize, canCustomDimensions, customWidth, customHeight, upscale, checkBeforeUpscale, t]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setImageLoaded(false);
    setLimitError(null);
    setInputDims({ w: 0, h: 0 });
    hasRecorded.current = false;
    reset();
  }, [previewUrl, reset]);

  const handleDimensionsChange = useCallback((w: number, h: number) => {
    setCustomWidth(w);
    setCustomHeight(h);
  }, []);

  if (usageLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm font-body text-muted">{t("loadingModel")}</p>
      </div>
    );
  }

  const modeToggle = canBatch ? (
    <div className="mb-8 flex items-center justify-center gap-2">
      <button
        onClick={() => { setMode("single"); handleReset(); }}
        className={`min-h-10 rounded-sm px-5 text-sm font-medium font-body transition-colors duration-200 ${
          mode === "single" ? "bg-ink text-paper" : "border border-border text-muted hover:text-ink"
        }`}
      >
        {t("upscaleButton")}
      </button>
      <button
        onClick={() => { setMode("batch"); handleReset(); }}
        className={`min-h-10 rounded-sm px-5 text-sm font-medium font-body transition-colors duration-200 ${
          mode === "batch" ? "bg-ink text-paper" : "border border-border text-muted hover:text-ink"
        }`}
      >
        {t("batchTitle")}
      </button>
    </div>
  ) : null;

  if (mode === "batch" && canBatch) {
    return (
      <div>
        {modeToggle}
        <BatchUploader
          scale={scale}
          format={format}
          quality={quality}
          maxScale={maxScale}
          maxFileSize={maxFileSize}
          batchLimit={batchLimit}
          allowedFormats={allowedFormats}
          patchSize={patchSize}
          onScaleChange={setScale}
          onFormatChange={setFormat}
          onQualityChange={setQuality}
        />
      </div>
    );
  }

  // Idle
  if (state === "idle" && !imageLoaded) {
    return (
      <div>
        {modeToggle}
        <DropZone onFileSelect={handleFileSelect} maxFileSize={maxFileSize} />
      </div>
    );
  }

  // Image loaded
  if (state === "idle" && imageLoaded && previewUrl) {
    return (
      <div>
        {modeToggle}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="overflow-hidden border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt={file?.name || "Uploaded image"} className="h-auto w-full" />
          </div>
          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-xs font-body uppercase tracking-widest text-muted">
                {t("scaleLabel")}
              </label>
              <ScaleSelector value={scale} onChange={setScale} maxScale={maxScale} />
            </div>

            <div>
              <label className="mb-3 block text-xs font-body uppercase tracking-widest text-muted">
                {t("formatLabel")}
              </label>
              <FormatSelector value={format} onChange={setFormat} allowedFormats={allowedFormats} />
            </div>

            {(format === "jpeg" || format === "webp") && (
              <div>
                <label htmlFor="quality-slider" className="mb-3 block text-xs font-body uppercase tracking-widest text-muted">
                  {t("qualityLabel")}
                  <span className="ms-2 font-mono normal-case tracking-normal text-ink">{quality}</span>
                </label>
                <input id="quality-slider" type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-accent" />
              </div>
            )}

            {inputDims.w > 0 && (
              <CustomDimensions
                inputWidth={inputDims.w}
                inputHeight={inputDims.h}
                scale={scale}
                enabled={canCustomDimensions}
                onDimensionsChange={handleDimensionsChange}
              />
            )}

            {limitError && (
              <div className="space-y-3">
                <p className="text-sm font-body text-error">{limitError}</p>
                <Link href="/pricing" className="inline-flex min-h-10 items-center rounded-sm bg-accent px-5 text-sm font-medium font-body text-white transition-colors duration-200 hover:bg-accent-hover">
                  {t("upgradePrompt")}
                </Link>
              </div>
            )}

            <button type="button" onClick={handleUpscale} className="inline-flex w-full min-h-12 cursor-pointer items-center justify-center rounded-sm bg-accent px-6 text-sm font-medium font-body text-white transition-colors duration-200 ease-out hover:bg-accent-hover">
              {t("upscaleButton")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading-model" || state === "processing") {
    return (
      <div className="space-y-6 text-center">
        <p className="font-body text-muted">
          {state === "loading-model" ? t("loadingModel") : t("processing")}
        </p>
        <ProcessingBar progress={progress} />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-6 text-center">
        <p className="font-body text-error">{error || t("errorProcessing")}</p>
        <button type="button" onClick={handleReset} className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border border-ink bg-transparent px-6 text-sm font-medium font-body text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-paper">
          {t("newImage")}
        </button>
      </div>
    );
  }

  if (state === "complete" && result && previewUrl) {
    return (
      <div className="space-y-8">
        <BeforeAfterSlider beforeSrc={previewUrl} afterSrc={result.imageUrl} />
        <OutputPreview stats={result.stats} />
        <div className="flex flex-wrap justify-center gap-4">
          <DownloadButton imageUrl={result.imageUrl} filename={`upscaled_${file?.name || "image"}.${format}`} />
          <button type="button" onClick={handleReset} className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border border-ink bg-transparent px-6 text-sm font-medium font-body text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-paper">
            {t("newImage")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
