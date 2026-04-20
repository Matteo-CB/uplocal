"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function CookieConsent() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-surface p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p className="text-sm text-muted">{t("cookieConsent")}</p>
        <button
          onClick={handleAccept}
          className="shrink-0 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors duration-200"
        >
          {t("cookieOk")}
        </button>
      </div>
    </div>
  );
}
