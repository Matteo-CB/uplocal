"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";

export function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/upscale" as const, label: t("upscale") },
    { href: "/pricing" as const, label: t("pricing") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <nav className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition-colors duration-200 ${
            pathname === link.href
              ? "text-ink font-medium"
              : "text-muted hover:text-ink"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
