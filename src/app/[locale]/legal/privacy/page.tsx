import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.privacy" });

  return generatePageMetadata({
    locale,
    path: "/legal/privacy",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const SECTION_KEYS = [
  { id: "introduction", titleKey: "introduction", paragraphs: ["introP1", "introP2", "introP3"] },
  { id: "image-processing", titleKey: "imageProcessing", paragraphs: ["imageProcessingP1", "imageProcessingP2", "imageProcessingP3"] },
  { id: "data-we-collect", titleKey: "dataWeCollect", paragraphs: ["dataCollectP1"], list: "dataCollectList" },
  { id: "how-we-use-data", titleKey: "howWeUseData", paragraphs: ["useDataP1", "useDataP2"] },
  { id: "third-party", titleKey: "thirdParty", paragraphs: ["thirdPartyP1"], list: "thirdPartyList" },
  { id: "cookies", titleKey: "cookies", paragraphs: ["cookiesP1"], list: "cookiesList", afterListParagraphs: ["cookiesP2"] },
  { id: "storage", titleKey: "storage", paragraphs: ["storageP1"] },
  { id: "retention", titleKey: "retention", paragraphs: ["retentionP1"] },
  { id: "rights", titleKey: "rights", paragraphs: ["rightsP1", "rightsP2"] },
  { id: "contact", titleKey: "contact", paragraphs: ["contactP1"], list: "contactList" },
] as const;

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPages.privacy" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="py-24">
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Uplocal", url: "https://uplocal.app" },
          { name: t("title"), url: `https://uplocal.app/${locale}/legal/privacy` },
        ])}
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block" aria-label={tCommon("tableOfContents")}>
            <div className="lg:sticky lg:top-24">
              <span className="mb-4 block font-body text-xs uppercase tracking-widest text-muted">
                {tCommon("onThisPage")}
              </span>
              <ul className="space-y-3">
                {SECTION_KEYS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block font-body text-sm text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {t(`sections.${s.titleKey}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="max-w-3xl">
            <h1 className="mb-4 font-display text-4xl text-ink md:text-5xl">
              {t("title")}
            </h1>
            <p className="mb-12 font-mono text-sm text-muted">
              {t("lastUpdated")}
            </p>

            {SECTION_KEYS.map((s) => (
              <div key={s.id} id={s.id} className="mb-12 scroll-mt-28">
                <h2 className="mb-4 font-display text-2xl text-ink">
                  {t(`sections.${s.titleKey}`)}
                </h2>
                <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{t(`content.${p}`)}</p>
                  ))}
                  {"list" in s && s.list && (
                    <ul className="list-disc space-y-2 ps-6">
                      {t(`content.${s.list}`)
                        .split("|")
                        .map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                    </ul>
                  )}
                  {"afterListParagraphs" in s && s.afterListParagraphs && s.afterListParagraphs.map((p) => (
                    <p key={p}>{t(`content.${p}`)}</p>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
