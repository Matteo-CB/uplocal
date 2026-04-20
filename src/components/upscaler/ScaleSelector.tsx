"use client";

import { useTranslations } from "next-intl";

interface ScaleSelectorProps {
  value: 2 | 4 | 8;
  onChange: (scale: 2 | 4 | 8) => void;
  maxScale: 2 | 4 | 8;
}

const SCALES: { value: 2 | 4 | 8; requiredPlan: "free" | "pro" | "studio" }[] = [
  { value: 2, requiredPlan: "free" },
  { value: 4, requiredPlan: "pro" },
  { value: 8, requiredPlan: "studio" },
];

export function ScaleSelector({ value, onChange, maxScale }: ScaleSelectorProps) {
  const t = useTranslations("upscaler");

  return (
    <div className="flex gap-3" role="radiogroup" aria-label={t("scaleLabel")}>
      {SCALES.map((scale) => {
        const isDisabled = scale.value > maxScale;
        const isSelected = value === scale.value;

        return (
          <button
            key={scale.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => onChange(scale.value)}
            className={`relative inline-flex items-center justify-center rounded-sm min-h-12 px-5 text-sm font-medium transition-colors duration-200 cursor-pointer font-mono ${
              isSelected
                ? "bg-ink text-paper"
                : isDisabled
                ? "border border-border text-muted cursor-not-allowed opacity-60"
                : "border border-border text-ink hover:border-ink"
            }`}
          >
            <span>{scale.value}x</span>
            {isDisabled && (
              <span className="ms-2 inline-flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="6"
                    width="8"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 6V4C5 2.89543 5.89543 2 7 2C8.10457 2 9 2.89543 9 4V6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
                <span className="text-xs font-body">
                  {scale.requiredPlan === "pro" ? t("pro") : t("studio")}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
