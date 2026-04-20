import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { ManageBillingButton } from "@/components/dashboard/ManageBillingButton";
import { Link } from "@/lib/i18n/navigation";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return generatePageMetadata({
    locale,
    path: "/dashboard",
    title: `${t("title")} | Uplocal`,
    description: t("title"),
    noIndex: true,
  });
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const session = await auth();

  const userName = session?.user?.name || session?.user?.email || "";

  let plan = "FREE";
  let totalUpscales = 0;
  let avgTime = 0;
  const dailyCounts: Record<string, number> = {};

  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    if (subscription) {
      plan = subscription.plan;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    totalUpscales = usageRecords.length;

    if (totalUpscales > 0) {
      const totalTime = usageRecords.reduce(
        (sum, r) => sum + r.processingTime,
        0
      );
      avgTime = Math.round(totalTime / totalUpscales);
    }

    for (const record of usageRecords) {
      const day = record.createdAt.toISOString().split("T")[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
  }

  const avgTimeDisplay =
    avgTime > 1000
      ? `${(avgTime / 1000).toFixed(1)}s`
      : `${avgTime}ms`;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-4xl text-ink">
          {t("welcome")}, {userName}
        </h1>

        <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>{t("plan")}</SectionLabel>
          </div>
          <div className="border border-border bg-surface p-6 transition-colors duration-200 hover:border-ink">
            <p className="font-display text-2xl text-ink">
              {plan}
            </p>
            {plan === "FREE" && (
              <Link
                href="/pricing"
                className="mt-3 inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover font-body"
              >
                {t("upgrade")}
              </Link>
            )}
            {plan !== "FREE" && (
              <ManageBillingButton label={t("manageBilling")} />
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>{t("usage")}</SectionLabel>
          </div>
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-widest text-muted font-body">
                  {t("totalUpscales")}
                </p>
                <p className="mt-2 font-mono text-3xl text-ink">
                  {totalUpscales}
                </p>
              </div>
              <div className="border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-widest text-muted font-body">
                  {t("avgTime")}
                </p>
                <p className="mt-2 font-mono text-3xl text-ink">
                  {totalUpscales > 0 ? avgTimeDisplay : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <UsageChart dailyCounts={dailyCounts} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
          <div>
            <SectionLabel>{t("history")}</SectionLabel>
          </div>
          <div>
            {totalUpscales === 0 ? (
              <p className="text-muted font-body">
                {t("noHistory")}
              </p>
            ) : (
              <Link
                href="/dashboard/history"
                className="text-sm text-accent underline transition-colors duration-200 hover:text-accent-hover font-body"
              >
                {t("historyTitle")}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/upscale"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover font-body"
            >
              {t("upscaleNow")}
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-ink bg-transparent px-6 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-paper font-body"
            >
              {t("settings")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
