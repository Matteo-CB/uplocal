import type { Metadata } from "next";
import { routing } from "@/lib/i18n/routing";

const SITE_URL = "https://uplocal.app";

export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  noIndex,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${SITE_URL}/${loc}${path}`;
  }
  alternates["x-default"] = `${SITE_URL}/en${path}`;

  const otherLocales = routing.locales.filter((l) => l !== locale);

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Uplocal",
      images: [
        {
          url: `${SITE_URL}/og/og-${locale}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      alternateLocale: otherLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og/og-${locale}.png`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
  };
}
