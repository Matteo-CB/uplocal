import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="32" height="32" fill="currentColor" className="text-ink"/>
                <rect width="32" height="2" fill="#C2410C"/>
                <text x="16" y="22" textAnchor="middle" fill="var(--color-paper)" fontFamily="serif" fontSize="20" fontWeight="400">U</text>
                <circle cx="24" cy="11" r="2" fill="#C2410C"/>
              </svg>
              <span className="font-display text-xl text-ink">Uplocal</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t("footer.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
                {t("footer.product")}
              </h3>
              <nav className="mt-4 flex flex-col gap-3">
                <Link
                  href="/upscale"
                  className="text-sm text-ink transition-colors duration-200 hover:text-accent"
                >
                  {t("nav.upscale")}
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-ink transition-colors duration-200 hover:text-accent"
                >
                  {t("nav.pricing")}
                </Link>
                <Link
                  href="/faq"
                  className="text-sm text-ink transition-colors duration-200 hover:text-accent"
                >
                  {t("nav.faq")}
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
                {t("footer.company")}
              </h3>
              <nav className="mt-4 flex flex-col gap-3">
                <Link
                  href="/about"
                  className="text-sm text-ink transition-colors duration-200 hover:text-accent"
                >
                  {t("nav.about")}
                </Link>
              </nav>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
              {t("footer.legal")}
            </h3>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="/legal/privacy"
                className="text-sm text-ink transition-colors duration-200 hover:text-accent"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-ink transition-colors duration-200 hover:text-accent"
              >
                {t("footer.terms")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t("footer.madeBy")}{" "}
            <a
              href="https://hiddenlab.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors duration-200"
            >
              HiddenLab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
