import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryGrid } from "@/components/dashboard/HistoryGrid";

interface HistoryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HistoryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return generatePageMetadata({
    locale,
    path: "/dashboard/history",
    title: `${t("historyTitle")} | Uplocal`,
    description: t("historyTitle"),
    noIndex: true,
  });
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const session = await auth();

  let records: {
    id: string;
    scale: number;
    inputWidth: number;
    inputHeight: number;
    outputWidth: number;
    outputHeight: number;
    inputFormat: string;
    outputFormat: string;
    processingTime: number;
    createdAt: string;
  }[] = [];

  if (session?.user?.id) {
    const dbRecords = await prisma.usageRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    records = dbRecords.map((r) => ({
      id: r.id,
      scale: r.scale,
      inputWidth: r.inputWidth,
      inputHeight: r.inputHeight,
      outputWidth: r.outputWidth,
      outputHeight: r.outputHeight,
      inputFormat: r.inputFormat,
      outputFormat: r.outputFormat,
      processingTime: r.processingTime,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-4xl text-ink">
          {t("historyTitle")}
        </h1>

        <div className="mt-12">
          <HistoryGrid records={records} emptyMessage={t("noHistory")} />
        </div>
      </div>
    </section>
  );
}
