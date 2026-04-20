import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

import { SetLocaleAttrs } from "@/components/layout/SetLocaleAttrs";
import type { ReactNode } from "react";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <SetLocaleAttrs locale={locale} />
        <a href="#main-content" className="skip-nav">
          {tCommon("skipToContent")}
        </a>
        <Header />
        <main id="main-content" className="pt-18">
          {children}
        </main>
        <Footer />
      </Providers>
    </NextIntlClientProvider>
  );
}
