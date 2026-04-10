import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateWebAppSchema, generateOrganizationSchema } from "@/lib/seo/structured-data";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { PricingTable } from "@/components/pricing/PricingTable";
import { HomeFAQ } from "./HomeFAQ";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return generatePageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const faqItems = [
    { question: t("faq.items.0.question"), answer: t("faq.items.0.answer") },
    { question: t("faq.items.1.question"), answer: t("faq.items.1.answer") },
    { question: t("faq.items.2.question"), answer: t("faq.items.2.answer") },
    { question: t("faq.items.3.question"), answer: t("faq.items.3.answer") },
  ];

  return (
    <>
      <StructuredData data={generateWebAppSchema()} />
      <StructuredData data={generateOrganizationSchema()} />

      {/* Hero */}
      <section className="relative overflow-hidden py-28 md:py-40 lg:py-48">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-20">
            <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
              <h1 className="font-display text-4xl leading-[1.1] text-ink md:text-5xl lg:text-6xl xl:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted md:text-xl">
                {t("hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/upscale"
                  className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-8 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
                >
                  {t("hero.cta")}
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex min-h-12 items-center justify-center rounded-sm border border-ink bg-transparent px-8 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-paper"
                >
                  {t("hero.secondaryCta")}
                </Link>
              </div>
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="relative aspect-4/3 border border-border bg-surface">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mx-auto h-48 w-64 overflow-hidden border border-border">
                      <div className="absolute inset-0 bg-accent-light" />
                      <div className="absolute inset-y-0 inset-e-0 w-1/2 bg-accent/5" />
                      <div className="absolute inset-y-0 inset-s-1/2 w-px bg-accent" />
                      <div className="absolute inset-s-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-8 w-8 rounded-full border-2 border-accent bg-paper" />
                      </div>
                    </div>
                    <p className="mt-4 font-mono text-xs tracking-wider text-muted">
                      {t("upscaler2.scaleDemo")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
      </section>

      {/* Trust Bar */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 divide-x divide-border">
            {[
              { text: t("trust.browser") },
              { text: t("trust.noUpload") },
            ].map((item, i) => (
              <div
                key={i}
                className="animate-fade-in px-4 text-center first:ps-0 last:pe-0"
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                <span className="font-mono text-xs uppercase tracking-widest text-ink md:text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-3">
              <SectionLabel>{t("howItWorks.sectionLabel")}</SectionLabel>
            </div>
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12">
                {(["step1", "step2", "step3"] as const).map((step, i) => (
                  <div
                    key={step}
                    className="animate-fade-in"
                    style={{ animationDelay: `${400 + i * 100}ms` }}
                  >
                    <span className="block font-display text-7xl leading-none text-border/60 md:text-8xl">
                      {t(`howItWorks.${step}.number`)}
                    </span>
                    <h3 className="mt-6 font-display text-xl text-ink md:text-2xl">
                      {t(`howItWorks.${step}.title`)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {t(`howItWorks.${step}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-3">
              <SectionLabel>{t("features.sectionLabel")}</SectionLabel>
              <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
                {t("upscaler2.builtDifferent")}
              </h2>
            </div>
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 gap-0 divide-y divide-border sm:grid-cols-2 sm:gap-px sm:divide-y-0 sm:bg-border">
                {(["privacy", "quality", "speed", "formats"] as const).map(
                  (key, i) => (
                    <div
                      key={key}
                      className="animate-fade-in bg-paper p-8 sm:p-10"
                      style={{ animationDelay: `${500 + i * 80}ms` }}
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-accent">
                        0{i + 1}
                      </span>
                      <h3 className="mt-4 font-display text-xl text-ink md:text-2xl">
                        {t(`features.${key}.title`)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {t(`features.${key}.description`)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-surface py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <SectionLabel>{t("pricing.sectionLabel")}</SectionLabel>
            <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
              {t("pricing.title")}
            </h2>
            <p className="mt-3 text-muted">{t("pricing.subtitle")}</p>
          </div>

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

      {/* FAQ Partial */}
      <section className="border-t border-border py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-3">
              <SectionLabel>{t("faq.sectionLabel")}</SectionLabel>
              <h2 className="mt-4 font-display text-3xl text-ink">
                {t("faq.title")}
              </h2>
            </div>
            <div className="md:col-span-9">
              <HomeFAQ items={faqItems} />
              <div className="mt-10">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 text-sm text-accent transition-colors duration-200 hover:text-accent-hover"
                >
                  {t("faq.seeAll")}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-surface py-28 md:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-ink md:text-5xl">
            {t("hero.cta")}
          </h2>
          <p className="mt-6 text-lg text-muted">{t("hero.subtitle")}</p>
          <div className="mt-10">
            <Link
              href="/upscale"
              className="inline-flex min-h-14 items-center justify-center rounded-sm bg-accent px-10 text-base font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              {t("pricing.free.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
