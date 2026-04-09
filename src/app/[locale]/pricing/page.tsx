import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/components/shared/StructuredData";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FeatureComparison } from "@/components/pricing/FeatureComparison";
import { SectionLabel } from "@/components/shared/SectionLabel";

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return generatePageMetadata({
    locale,
    path: "/pricing",
    title: `${t("title")} | Uplocal`,
    description: t("subtitle"),
  });
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  const productSchema = generateProductSchema({
    free: { name: t("free.name"), price: t("free.price") },
    pro: {
      name: t("pro.name"),
      priceMonthly: t("pro.priceMonthly"),
      priceYearly: t("pro.priceYearly"),
    },
    studio: {
      name: t("studio.name"),
      priceMonthly: t("studio.priceMonthly"),
      priceYearly: t("studio.priceYearly"),
    },
  });

  return (
    <>
      <StructuredData data={productSchema} />
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Uplocal", url: "https://uplocal.app" },
        { name: t("title"), url: `https://uplocal.app/${locale}/pricing` },
      ])} />
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <SectionLabel>{t("sectionLabel")}</SectionLabel>
            </div>
            <div>
              <h1 className="font-display text-4xl text-ink lg:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted font-body">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <PricingTable
            locale={locale}
            priceIds={{
              proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
              proYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
              studioMonthly: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || "",
              studioYearly: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID || "",
            }}
          />
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 font-display text-3xl text-ink">
            {t("comparison.title")}
          </h2>
          <FeatureComparison />
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <StructuredData data={generateFAQSchema(
            ["switch", "refund", "cancel"].map(key => ({
              question: t(`faq.${key}.question`),
              answer: t(`faq.${key}.answer`),
            }))
          )} />
          <h2 className="mb-12 font-display text-3xl text-ink">
            {t("sectionLabel")} FAQ
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {(["switch", "refund", "cancel"] as const).map((key) => (
              <div key={key}>
                <h3 className="mb-3 font-display text-xl text-ink">
                  {t(`faq.${key}.question`)}
                </h3>
                <p className="text-muted font-body">
                  {t(`faq.${key}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
