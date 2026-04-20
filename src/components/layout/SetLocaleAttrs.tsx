"use client";

import { useEffect } from "react";

interface SetLocaleAttrsProps {
  locale: string;
}

export function SetLocaleAttrs({ locale }: SetLocaleAttrsProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
