"use client";

import { useTranslations } from "next-intl";

const FEATURE_KEYS = [
  "upscalesPerDay",
  "maxScale",
  "outputFormats",
  "batchProcessing",
  "maxFileSize",
  "customDimensions",
  "apiAccess",
  "commercialLicense",
] as const;

const PLANS = ["free", "pro", "studio"] as const;

function CheckCircle() {
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

function renderCellValue(value: string, yesLabel: string, noLabel: string) {
  if (value === "Yes" || value === yesLabel) {
    return <CheckCircle />;
  }
  if (value === "No" || value === noLabel) {
    return (
      <span className="text-sm text-muted font-body">
        {noLabel}
      </span>
    );
  }
  return (
    <span className="text-sm text-ink font-body">
      {value}
    </span>
  );
}

export function FeatureComparison() {
  const t = useTranslations("pricing.comparison");
  const tCommon = useTranslations("common");
  const tPricing = useTranslations("pricing");
  const yesLabel = tCommon("yes");
  const noLabel = tCommon("no");

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-ink">
            <th className="pb-4 pe-4 text-start text-xs uppercase tracking-widest text-muted font-body">
              {t("feature")}
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan}
                className="pb-4 px-4 text-center text-xs uppercase tracking-widest text-muted font-body"
              >
                {plan === "free"
                  ? tPricing("free.name")
                  : plan === "pro"
                  ? tPricing("pro.name")
                  : tPricing("studio.name")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURE_KEYS.map((featureKey) => (
            <tr
              key={featureKey}
              className="border-b border-border transition-colors duration-200 hover:bg-surface"
            >
              <td className="py-4 pe-4 text-sm text-ink font-body">
                {t(featureKey)}
              </td>
              {PLANS.map((plan) => (
                <td key={plan} className="px-4 py-4 text-center">
                  {renderCellValue(t(`${plan}_${featureKey}`), yesLabel, noLabel)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
