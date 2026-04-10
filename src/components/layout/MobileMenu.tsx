"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/upscale" as const, label: t("upscale") },
    { href: "/pricing" as const, label: t("pricing") },
    { href: "/about" as const, label: t("about") },
    { href: "/faq" as const, label: t("faq") },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 bg-paper transition-opacity duration-200 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex h-full flex-col px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-ink">
            Uplocal
          </span>
          <button
            onClick={onClose}
            className="text-sm text-muted transition-colors duration-200 hover:text-ink"
            aria-label={tCommon("closeMenu")}
          >
            {tCommon("close")}
          </button>
        </div>

        <nav className="mt-16 flex flex-col gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="font-display text-4xl text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-6 pb-8">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-sm text-muted transition-colors duration-200 hover:text-ink cursor-pointer"
                >
                  {t("signout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={onClose}
                  className="text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  {t("signin")}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
                >
                  {t("signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
