import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { UpscalerCanvasLoader } from "@/components/upscaler/UpscalerCanvasLoader";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return generatePageMetadata({
    locale,
    path: "/upscale",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  });
}

export default async function UpscalePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "upscaler" });

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-3xl md:text-4xl text-ink text-center">
          {t("title")}
        </h1>
        <StructuredData data={generateBreadcrumbSchema([
          { name: "Uplocal", url: "https://uplocal.app" },
          { name: t("title"), url: `https://uplocal.app/${locale}/upscale` },
        ])} />
        <div className="mt-12">
          <UpscalerCanvasLoader />
        </div>
      </div>
    </section>
  );
}
