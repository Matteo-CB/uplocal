import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountSettings } from "@/components/dashboard/AccountSettings";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SettingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return generatePageMetadata({
    locale,
    path: "/dashboard/settings",
    title: `${t("settingsTitle")} | Uplocal`,
    description: t("settingsTitle"),
    noIndex: true,
  });
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const session = await auth();

  let preferences = {
    defaultScale: 2,
    defaultFormat: "png",
    defaultQuality: 90,
    theme: "system",
    locale: "en",
  };

  if (session?.user?.id) {
    const userPrefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    if (userPrefs) {
      preferences = {
        defaultScale: userPrefs.defaultScale,
        defaultFormat: userPrefs.defaultFormat,
        defaultQuality: userPrefs.defaultQuality,
        theme: userPrefs.theme,
        locale: userPrefs.locale,
      };
    }
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-4xl text-ink">
          {t("settingsTitle")}
        </h1>

        <div className="mt-12 max-w-xl">
          <AccountSettings
            initialPreferences={preferences}
            labels={{
              defaultScale: t("defaultScale"),
              defaultFormat: t("defaultFormat"),
              defaultQuality: t("defaultQuality"),
              theme: t("theme"),
              language: t("language"),
              save: t("save"),
              saved: t("saved"),
            }}
          />
        </div>
      </div>
    </section>
  );
}
