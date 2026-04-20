"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled ? "bg-paper border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink"
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="32" height="32" fill="currentColor"/>
            <rect width="32" height="2" fill="#C2410C"/>
            <text x="16" y="22" textAnchor="middle" fill="var(--color-paper)" fontFamily="serif" fontSize="20" fontWeight="400">U</text>
            <circle cx="24" cy="11" r="2" fill="#C2410C"/>
          </svg>
          <span className="font-display text-2xl">Uplocal</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Navigation />
          <LanguageSwitcher />
          <ThemeToggle />
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                {t("dashboard")}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-muted transition-colors duration-200 hover:text-ink cursor-pointer"
              >
                {t("signout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                {t("signin")}
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex min-h-10 items-center rounded-sm bg-accent px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                {t("signup")}
              </Link>
            </>
          )}
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label={tCommon("openMenu")}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-4 bg-ink" />
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
