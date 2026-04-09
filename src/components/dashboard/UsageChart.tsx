"use client";

interface UsageChartProps {
  dailyCounts: Record<string, number>;
}

export function UsageChart({ dailyCounts }: UsageChartProps) {
  const entries = Object.entries(dailyCounts);

  if (entries.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center border border-border bg-surface">
        <p className="text-sm text-muted font-body">
          No usage data yet.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...entries.map(([, count]) => count), 1);
  const chartHeight = 160;

  // Fill in the last 30 days for a complete chart
  const days: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, count: dailyCounts[dateStr] || 0 });
  }

  const barWidth = 100 / days.length;

  return (
    <div className="border border-border bg-surface p-6">
      <div className="relative" style={{ height: `${chartHeight + 32}px` }}>
        {/* Y-axis labels */}
        <div className="absolute start-0 top-0 flex h-[160px] flex-col justify-between pe-3">
          <span className="text-[10px] text-muted font-mono">
            {maxCount}
          </span>
          <span className="text-[10px] text-muted font-mono">
            {Math.round(maxCount / 2)}
          </span>
          <span className="text-[10px] text-muted font-mono">
            0
          </span>
        </div>

        {/* Chart area */}
        <div className="ms-8">
          {/* Grid lines */}
          <div className="relative" style={{ height: `${chartHeight}px` }}>
            <div className="absolute top-0 w-full border-t border-border" />
            <div className="absolute top-1/2 w-full border-t border-border opacity-50" />
            <div className="absolute bottom-0 w-full border-t border-border" />

            {/* Bars */}
            <svg
              width="100%"
              height={chartHeight}
              viewBox={`0 0 ${days.length * 10} ${chartHeight}`}
              preserveAspectRatio="none"
              aria-label="Usage chart showing daily upscale counts for the last 30 days"
              role="img"
            >
              {days.map((day, i) => {
                const barHeight =
                  day.count > 0
                    ? (day.count / maxCount) * chartHeight
                    : 0;
                return (
                  <rect
                    key={day.date}
                    x={i * 10 + 1}
                    y={chartHeight - barHeight}
                    width={8}
                    height={barHeight}
                    fill="var(--color-accent)"
                    className="transition-all duration-200"
                  >
                    <title>
                      {day.date}: {day.count}
                    </title>
                  </rect>
                );
              })}
            </svg>
          </div>

          {/* X-axis labels: show every 5th day */}
          <div className="mt-2 flex">
            {days.map((day, i) => (
              <div
                key={day.date}
                style={{ width: `${barWidth}%` }}
                className="text-center"
              >
                {i % 5 === 0 && (
                  <span className="text-[10px] text-muted font-mono">
                    {day.date.slice(5)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
