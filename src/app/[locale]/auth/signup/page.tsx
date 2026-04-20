import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SignUpPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return generatePageMetadata({
    locale,
    path: "/auth/signup",
    title: `${t("signupTitle")} | Uplocal`,
    description: t("signupTitle"),
    noIndex: true,
  });
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-md px-6">
        <div className="mb-10 text-center">
          <span className="font-display text-3xl text-ink">
            Uplocal
          </span>
        </div>

        <h1 className="mb-8 text-center font-display text-2xl text-ink">
          {t("signupTitle")}
        </h1>

        <SignUpForm
          locale={locale}
          labels={{
            google: t("google"),
            hasAccount: t("hasAccount"),
            signinLink: t("signinLink"),
            error: t("error"),
          }}
        />
      </div>
    </section>
  );
}
