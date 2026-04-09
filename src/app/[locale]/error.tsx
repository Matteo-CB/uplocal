"use client";

import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("common");

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="mb-4 font-display text-3xl text-ink md:text-4xl">
          {t("error")}
        </h1>
        <p className="mb-8 text-base text-muted">
          {t("notFoundDescription")}
        </p>
        <button
          onClick={reset}
          className="inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          {t("retry")}
        </button>
      </div>
    </section>
  );
}
