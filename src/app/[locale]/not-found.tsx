import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("common");

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="mb-6 font-mono text-8xl font-light text-border">
          404
        </p>
        <h1 className="mb-4 font-display text-3xl text-ink md:text-4xl">
          {t("notFound")}
        </h1>
        <p className="mb-8 text-base text-muted">
          {t("notFoundDescription")}
        </p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
