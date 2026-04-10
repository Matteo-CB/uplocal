"use client";

import { useTranslations } from "next-intl";

interface ProcessingBarProps {
  progress: number;
}

export function ProcessingBar({ progress }: ProcessingBarProps) {
  const tU2 = useTranslations("upscaler2");
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={tU2("upscalingProgress")}
        className="relative w-full h-1.5 bg-border overflow-hidden"
      >
        <div
          className="absolute inset-y-0 start-0 bg-accent transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-mono text-muted text-center">
        {clampedProgress}%
      </p>
    </div>
  );
}
