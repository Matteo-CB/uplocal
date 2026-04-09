"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlanCard } from "./PlanCard";

interface PriceIds {
  proMonthly: string;
  proYearly: string;
  studioMonthly: string;
  studioYearly: string;
}

interface PricingTableProps {
  locale: string;
  priceIds: PriceIds;
}

export function PricingTable({ locale, priceIds }: PricingTableProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const t = useTranslations("pricing");

  async function handleCheckout(priceId: string) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, locale }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div>
      <div className="mb-12 flex items-center justify-center gap-4">
        <button
          onClick={() => setBilling("monthly")}
          className={`min-h-12 rounded-sm px-6 text-sm font-medium font-body transition-colors duration-200 ${
            billing === "monthly"
              ? "bg-ink text-paper"
              : "border border-border text-muted hover:text-ink"
          }`}
        >
          {t("toggle.monthly")}
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`min-h-12 rounded-sm px-6 text-sm font-medium font-body transition-colors duration-200 ${
            billing === "yearly"
              ? "bg-ink text-paper"
              : "border border-border text-muted hover:text-ink"
          }`}
        >
          {t("toggle.yearly")}
        </button>
        <span className="text-xs font-medium font-body text-accent">
          {t("toggle.save")}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PlanCard
          name={t("free.name")}
          price={t("free.price")}
          currency={t("currency")}
          period={t("free.period")}
          features={[
            t("free.features.0"),
            t("free.features.1"),
            t("free.features.2"),
            t("free.features.3"),
          ]}
          cta={t("free.cta")}
          highlighted={false}
          onSelect={() => {
            window.location.href = `/${locale}/auth/signup`;
          }}
        />
        <PlanCard
          name={t("pro.name")}
          price={
            billing === "monthly"
              ? t("pro.priceMonthly")
              : t("pro.priceYearly")
          }
          currency={t("currency")}
          period={
            billing === "monthly" ? t("pro.period") : t("pro.periodYearly")
          }
          features={[
            t("pro.features.0"),
            t("pro.features.1"),
            t("pro.features.2"),
            t("pro.features.3"),
            t("pro.features.4"),
          ]}
          cta={t("pro.cta")}
          highlighted={true}
          badge={t("pro.badge")}
          onSelect={() =>
            handleCheckout(
              billing === "monthly" ? priceIds.proMonthly : priceIds.proYearly
            )
          }
        />
        <PlanCard
          name={t("studio.name")}
          price={
            billing === "monthly"
              ? t("studio.priceMonthly")
              : t("studio.priceYearly")
          }
          currency={t("currency")}
          period={
            billing === "monthly"
              ? t("studio.period")
              : t("studio.periodYearly")
          }
          features={[
            t("studio.features.0"),
            t("studio.features.1"),
            t("studio.features.2"),
            t("studio.features.3"),
            t("studio.features.4"),
            t("studio.features.5"),
          ]}
          cta={t("studio.cta")}
          highlighted={false}
          onSelect={() =>
            handleCheckout(
              billing === "monthly"
                ? priceIds.studioMonthly
                : priceIds.studioYearly
            )
          }
        />
      </div>
    </div>
  );
}
