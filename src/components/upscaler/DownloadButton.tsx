"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

interface DownloadButtonProps {
  imageUrl: string;
  filename: string;
}

export function DownloadButton({ imageUrl, filename }: DownloadButtonProps) {
  const t = useTranslations("upscaler");

  const handleDownload = useCallback(() => {
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, [imageUrl, filename]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 rounded-sm min-h-12 px-6 text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors duration-200 ease-out cursor-pointer font-body"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 2V10M4 8L8 12L12 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M2 13H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
      {t("download")}
    </button>
  );
}
