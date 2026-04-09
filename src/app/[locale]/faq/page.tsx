import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/components/shared/StructuredData";
import { FAQAccordion } from "./faq-accordion";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });

  return generatePageMetadata({
    locale,
    path: "/faq",
    title: `${tFaq("sectionLabel")} | Uplocal`,
    description: t("description"),
    keywords: t("keywords"),
  });
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const items: { question: string; answer: string }[] = [];
  let index = 0;
  // next-intl: iterate over the faq.items array
  while (true) {
    try {
      const question = t(`items.${index}.question`);
      const answer = t(`items.${index}.answer`);
      if (!question) break;
      items.push({ question, answer });
      index++;
    } catch {
      break;
    }
  }

  const faqSchema = generateFAQSchema(items);

  return (
    <section className="py-24">
      <StructuredData data={faqSchema} />
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Uplocal", url: "https://uplocal.app" },
        { name: t("sectionLabel"), url: `https://uplocal.app/${locale}/faq` },
      ])} />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[240px_1fr]">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-body">
              {t("sectionLabel")}
            </span>
          </div>

          <div>
            <h1 className="mb-12 font-display text-4xl text-ink md:text-5xl">
              {t("sectionLabel")}
            </h1>

            <FAQAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
