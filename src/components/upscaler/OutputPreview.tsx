import { useTranslations } from "next-intl";

interface ProcessStats {
  inputWidth: number;
  inputHeight: number;
  outputWidth: number;
  outputHeight: number;
  processingTimeMs: number;
}

interface OutputPreviewProps {
  stats: ProcessStats;
}

export function OutputPreview({ stats }: OutputPreviewProps) {
  const t = useTranslations("upscaler");

  const timeSeconds = (stats.processingTimeMs / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border border-border bg-surface p-6">
      <div>
        <span className="block text-xs uppercase tracking-widest text-muted font-body">
          {t("originalSize")}
        </span>
        <span className="mt-1 block font-mono text-sm text-ink">
          {stats.inputWidth} x {stats.inputHeight}
        </span>
      </div>
      <div>
        <span className="block text-xs uppercase tracking-widest text-muted font-body">
          {t("upscaledSize")}
        </span>
        <span className="mt-1 block font-mono text-sm text-ink">
          {stats.outputWidth} x {stats.outputHeight}
        </span>
      </div>
      <div>
        <span className="block text-xs uppercase tracking-widest text-muted font-body">
          {t("processingTime")}
        </span>
        <span className="mt-1 block font-mono text-sm text-ink">
          {timeSeconds}s
        </span>
      </div>
    </div>
  );
}
