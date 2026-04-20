"use client";

import { useLocale } from "next-intl";

interface ManageBillingButtonProps {
  label: string;
}

export function ManageBillingButton({ label }: ManageBillingButtonProps) {
  const locale = useLocale();

  async function handleClick() {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-3 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border border-ink bg-transparent px-6 text-sm font-medium font-body text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
    >
      {label}
    </button>
  );
}
