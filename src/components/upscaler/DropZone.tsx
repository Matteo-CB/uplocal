"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/bmp",
];

const ACCEPTED_EXTENSIONS = ".png,.jpg,.jpeg,.webp,.bmp";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  maxFileSize?: number;
}

export function DropZone({ onFileSelect, maxFileSize }: DropZoneProps) {
  const t = useTranslations("upscaler");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(t("errorUnsupported"));
        return;
      }

      if (maxFileSize && file.size > maxFileSize) {
        const maxMB = Math.round(maxFileSize / (1024 * 1024));
        setError(`${t("errorTooLarge")} ${maxMB}MB.`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, maxFileSize, t]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex min-h-75 cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors duration-200 ${
          isDragging
            ? "border-accent bg-accent-light"
            : "border-border hover:border-accent"
        }`}
        aria-label={t("dropzone")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleChange}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        <svg
          className="mb-4 h-10 w-10 text-muted"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 6V28M12 14L20 6L28 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
          <path
            d="M6 28V32H34V28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>

        <p className="text-center font-body text-ink">{t("dropzone")}</p>
        <p className="mt-2 text-sm font-body text-muted">
          {t("dropzoneFormats")}
        </p>
      </div>

      {error && (
        <p className="mt-3 text-sm text-error font-body" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
