import { routing } from "@/lib/i18n/routing";

const SITE_URL = "https://uplocal.app";

export function generateHreflangLinks(path: string) {
  const links: { rel: string; hrefLang: string; href: string }[] =
    routing.locales.map((locale) => ({
      rel: "alternate",
      hrefLang: locale,
      href: `${SITE_URL}/${locale}${path}`,
    }));

  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: `${SITE_URL}/en${path}`,
  });

  return links;
}
