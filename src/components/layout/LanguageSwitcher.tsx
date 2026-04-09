"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

const localeNames: Record<string, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  es: "ES",
  pt: "PT",
  ja: "JA",
  ko: "KO",
  zh: "ZH",
  ar: "AR",
  hi: "HI",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value as (typeof routing.locales)[number];
    router.replace(
      { pathname },
      { locale: nextLocale }
    );
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-transparent text-sm text-muted outline-none cursor-pointer transition-colors duration-200 hover:text-ink"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
