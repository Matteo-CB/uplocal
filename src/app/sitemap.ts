import type { MetadataRoute } from "next";
import { routing } from "@/lib/i18n/routing";

const SITE_URL = "https://uplocal.app";

const publicPaths = [
  "",
  "/upscale",
  "/pricing",
  "/about",
  "/faq",
  "/legal/privacy",
  "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of publicPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : path === "/upscale" ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
