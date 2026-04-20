interface HistoryRecord {
  id: string;
  scale: number;
  inputWidth: number;
  inputHeight: number;
  outputWidth: number;
  outputHeight: number;
  inputFormat: string;
  outputFormat: string;
  processingTime: number;
  createdAt: string;
}

interface HistoryGridProps {
  records: HistoryRecord[];
  emptyMessage: string;
}

export function HistoryGrid({ records, emptyMessage }: HistoryGridProps) {
  if (records.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center border border-border bg-surface">
        <p className="text-muted font-body">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => {
        const date = new Date(record.createdAt);
        const dateStr = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const timeStr =
          record.processingTime > 1000
            ? `${(record.processingTime / 1000).toFixed(1)}s`
            : `${record.processingTime}ms`;

        return (
          <div
            key={record.id}
            className="border border-border bg-surface p-5 transition-colors duration-200 hover:border-ink"
          >
            <p className="text-xs text-muted font-body">
              {dateStr}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl text-ink">
                {record.scale}x
              </span>
              <span className="text-xs text-muted font-body">
                upscale
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted font-mono">
                {record.inputWidth}x{record.inputHeight} &rarr;{" "}
                {record.outputWidth}x{record.outputHeight}
              </p>
              <p className="text-xs text-muted font-mono">
                {record.inputFormat.toUpperCase()} &rarr;{" "}
                {record.outputFormat.toUpperCase()}
              </p>
              <p className="text-xs text-muted font-mono">
                {timeStr}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
