import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "de", "es", "pt", "ja", "ko", "zh", "ar", "hi"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/upscale": {
      en: "/upscale",
      fr: "/ameliorer",
      de: "/hochskalieren",
      es: "/mejorar",
      pt: "/melhorar",
      ja: "/upscale",
      ko: "/upscale",
      zh: "/upscale",
      ar: "/upscale",
      hi: "/upscale",
    },
    "/pricing": {
      en: "/pricing",
      fr: "/tarifs",
      de: "/preise",
      es: "/precios",
      pt: "/precos",
      ja: "/pricing",
      ko: "/pricing",
      zh: "/pricing",
      ar: "/pricing",
      hi: "/pricing",
    },
    "/about": {
      en: "/about",
      fr: "/a-propos",
      de: "/ueber-uns",
      es: "/sobre",
      pt: "/sobre",
      ja: "/about",
      ko: "/about",
      zh: "/about",
      ar: "/about",
      hi: "/about",
    },
    "/faq": "/faq",
    "/dashboard": "/dashboard",
    "/dashboard/settings": "/dashboard/settings",
    "/dashboard/history": "/dashboard/history",
    "/auth/signin": "/auth/signin",
    "/auth/signup": "/auth/signup",
    "/legal/privacy": "/legal/privacy",
    "/legal/terms": "/legal/terms",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type AppLocale = (typeof routing.locales)[number];
