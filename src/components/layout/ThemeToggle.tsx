"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored =
      document.cookie.match(/theme=([^;]+)/)?.[1] ||
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(stored as "light" | "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-sm text-muted transition-colors duration-200 hover:text-ink"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? t("themeDark") : t("themeLight")}
    </button>
  );
}
