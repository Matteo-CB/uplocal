import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { SectionLabel } from "@/components/shared/SectionLabel";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  return generatePageMetadata({
    locale,
    path: "/about",
    title: `${tAbout("sectionLabel")} | Uplocal`,
    description: t("description"),
    keywords: t("keywords"),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="mb-20 font-display text-4xl text-ink md:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <StructuredData data={generateBreadcrumbSchema([
          { name: "Uplocal", url: "https://uplocal.app" },
          { name: t("sectionLabel"), url: `https://uplocal.app/${locale}/about` },
        ])} />

        {/* Section: Why Uplocal Exists */}
        <div className="grid grid-cols-1 gap-12 border-t border-border py-16 md:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>{t("sectionLabel")}</SectionLabel>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-muted">
              {t("intro")}
            </p>
          </div>
        </div>

        {/* Section: How It Works */}
        <div className="grid grid-cols-1 gap-12 border-t border-border py-16 md:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>02</SectionLabel>
          </div>
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-3xl text-ink">
              {t("howTitle")}
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {t("howContent")}
            </p>
          </div>
        </div>

        {/* Section: Why Local Processing */}
        <div className="grid grid-cols-1 gap-12 border-t border-border py-16 md:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>03</SectionLabel>
          </div>
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-3xl text-ink">
              {t("whyTitle")}
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {t("whyContent")}
            </p>
          </div>
        </div>

        {/* Section: The Technology */}
        <div className="grid grid-cols-1 gap-12 border-t border-border py-16 md:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>04</SectionLabel>
          </div>
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-3xl text-ink">
              {t("techTitle")}
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {t("techContent")}
            </p>
          </div>
        </div>

        {/* Company info */}
        <div className="grid grid-cols-1 gap-12 border-t border-border py-16 md:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>05</SectionLabel>
          </div>
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-3xl text-ink">
              {t("companyTitle")}
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {t("companyContent")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
