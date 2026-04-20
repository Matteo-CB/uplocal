"use client";

import { useTranslations } from "next-intl";
import type { OutputFormat } from "@/types";

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  allowedFormats?: OutputFormat[];
}

const ALL_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

export function FormatSelector({
  value,
  onChange,
  allowedFormats,
}: FormatSelectorProps) {
  const t = useTranslations("upscaler");

  const formats = allowedFormats
    ? ALL_FORMATS.filter((f) => allowedFormats.includes(f.value))
    : ALL_FORMATS;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OutputFormat)}
        aria-label={t("formatLabel")}
        className="w-full cursor-pointer appearance-none border-b-2 border-border bg-transparent pb-2 pe-8 font-body text-ink outline-none transition-colors duration-200 focus:border-accent"
      >
        {formats.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute end-0 top-0.5 h-4 w-4 text-muted"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
