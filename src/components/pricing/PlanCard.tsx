interface PlanCardProps {
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
  onSelect: () => void;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#15803D" />
      <path
        d="M6 10.5L8.5 13L14 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlanCard({
  name,
  price,
  currency,
  period,
  features,
  cta,
  highlighted,
  badge,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col border bg-surface transition-colors duration-200 hover:border-ink ${
        highlighted ? "border-t-4 border-accent" : "border-border"
      }`}
    >
      {badge && (
        <span className="absolute top-0 end-0 bg-accent px-3 py-1 text-xs font-medium text-white font-body">
          {badge}
        </span>
      )}
      <div className="flex flex-1 flex-col p-8">
        <h3 className="font-display text-2xl text-ink">
          {name}
        </h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-mono text-4xl text-ink">
            {currency}
            {price}
          </span>
          <span className="text-sm text-muted font-body">
            / {period}
          </span>
        </div>

        <ul className="mt-8 flex flex-1 flex-col gap-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                <CheckIcon />
              </span>
              <span className="text-sm text-ink font-body">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={onSelect}
          className={`mt-8 flex min-h-12 w-full items-center justify-center rounded-sm text-sm font-medium transition-colors duration-200 font-body cursor-pointer ${
            highlighted
              ? "bg-accent text-white hover:bg-accent-hover"
              : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"
          }`}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
