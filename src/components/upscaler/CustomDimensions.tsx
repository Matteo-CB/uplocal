"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CustomDimensionsProps {
  inputWidth: number;
  inputHeight: number;
  scale: number;
  enabled: boolean;
  onDimensionsChange: (width: number, height: number) => void;
}

export function CustomDimensions({
  inputWidth,
  inputHeight,
  scale,
  enabled,
  onDimensionsChange,
}: CustomDimensionsProps) {
  const t = useTranslations("upscaler");
  const tU2 = useTranslations("upscaler2");
  const defaultWidth = inputWidth * scale;
  const defaultHeight = inputHeight * scale;

  const [useCustom, setUseCustom] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [lockRatio, setLockRatio] = useState(true);
  const aspectRatio = inputWidth / inputHeight;

  useEffect(() => {
    setWidth(defaultWidth);
    setHeight(defaultHeight);
  }, [defaultWidth, defaultHeight]);

  useEffect(() => {
    if (!useCustom) {
      onDimensionsChange(defaultWidth, defaultHeight);
    } else {
      onDimensionsChange(width, height);
    }
  }, [useCustom, width, height, defaultWidth, defaultHeight, onDimensionsChange]);

  const handleWidthChange = useCallback(
    (val: number) => {
      const w = Math.max(1, Math.min(val, 16384));
      setWidth(w);
      if (lockRatio) {
        setHeight(Math.round(w / aspectRatio));
      }
    },
    [lockRatio, aspectRatio]
  );

  const handleHeightChange = useCallback(
    (val: number) => {
      const h = Math.max(1, Math.min(val, 16384));
      setHeight(h);
      if (lockRatio) {
        setWidth(Math.round(h * aspectRatio));
      }
    },
    [lockRatio, aspectRatio]
  );

  if (!enabled) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="accent-accent"
          />
          <span className="text-xs font-body uppercase tracking-widest text-muted">
            {t("customDimensions")}
          </span>
        </label>
      </div>

      {useCustom && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor="custom-width"
              className="mb-1 block text-xs font-body text-muted"
            >
              {tU2("widthLabel")}
            </label>
            <input
              id="custom-width"
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="w-full border-b-2 border-border bg-transparent pb-1 font-mono text-sm text-ink outline-none transition-colors duration-200 focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={() => setLockRatio(!lockRatio)}
            className="mt-5 cursor-pointer text-muted transition-colors duration-200 hover:text-ink"
            aria-label={lockRatio ? tU2("unlockRatio") : tU2("lockRatio")}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              {lockRatio ? (
                <path
                  d="M6 8V6a4 4 0 118 0v2M4 8h12v10H4V8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M6 8V6a4 4 0 118 0M4 8h12v10H4V8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </button>

          <div className="flex-1">
            <label
              htmlFor="custom-height"
              className="mb-1 block text-xs font-body text-muted"
            >
              {tU2("heightLabel")}
            </label>
            <input
              id="custom-height"
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="w-full border-b-2 border-border bg-transparent pb-1 font-mono text-sm text-ink outline-none transition-colors duration-200 focus:border-accent"
            />
          </div>

          <span className="mt-5 text-xs font-mono text-muted">{tU2("pixelsUnit")}</span>
        </div>
      )}
    </div>
  );
}
