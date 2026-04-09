import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SignInForm } from "@/components/auth/SignInForm";

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SignInPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return generatePageMetadata({
    locale,
    path: "/auth/signin",
    title: `${t("signinTitle")} | Uplocal`,
    description: t("signinTitle"),
    noIndex: true,
  });
}

export default async function SignInPage({ params }: SignInPageProps) {
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
          {t("signinTitle")}
        </h1>

        <SignInForm
          locale={locale}
          labels={{
            google: t("google"),
            noAccount: t("noAccount"),
            signupLink: t("signupLink"),
            error: t("error"),
          }}
        />
      </div>
    </section>
  );
}
