"use client";

import { useState, type FormEvent } from "react";

interface AccountSettingsProps {
  initialPreferences: {
    defaultScale: number;
    defaultFormat: string;
    defaultQuality: number;
    theme: string;
    locale: string;
  };
  labels: {
    defaultScale: string;
    defaultFormat: string;
    defaultQuality: string;
    theme: string;
    language: string;
    save: string;
    saved: string;
  };
}

const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Francais" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Espanol" },
  { value: "pt", label: "Portugues" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

export function AccountSettings({
  initialPreferences,
  labels,
}: AccountSettingsProps) {
  const [scale, setScale] = useState(initialPreferences.defaultScale);
  const [format, setFormat] = useState(initialPreferences.defaultFormat);
  const [quality, setQuality] = useState(initialPreferences.defaultQuality);
  const [theme, setTheme] = useState(initialPreferences.theme);
  const [locale, setLocale] = useState(initialPreferences.locale);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/usage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultScale: scale,
          defaultFormat: format,
          defaultQuality: quality,
          theme,
          locale,
        }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch {
      // Error handling
    } finally {
      setSaving(false);
    }
  }

  const selectClasses =
    "w-full border-b-2 border-border bg-transparent pb-2 text-ink outline-none transition-colors duration-200 font-body focus:border-accent cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="defaultScale"
          className="text-xs uppercase tracking-widest text-muted font-body"
        >
          {labels.defaultScale}
        </label>
        <select
          id="defaultScale"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className={selectClasses}
        >
          <option value={2}>2x</option>
          <option value={4}>4x</option>
          <option value={8}>8x</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="defaultFormat"
          className="text-xs uppercase tracking-widest text-muted font-body"
        >
          {labels.defaultFormat}
        </label>
        <select
          id="defaultFormat"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className={selectClasses}
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="defaultQuality"
          className="text-xs uppercase tracking-widest text-muted font-body"
        >
          {labels.defaultQuality}: {quality}
        </label>
        <input
          id="defaultQuality"
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="flex justify-between">
          <span className="text-[10px] text-muted font-mono">
            1
          </span>
          <span className="text-[10px] text-muted font-mono">
            100
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="theme"
          className="text-xs uppercase tracking-widest text-muted font-body"
        >
          {labels.theme}
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={selectClasses}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="language"
          className="text-xs uppercase tracking-widest text-muted font-body"
        >
          {labels.language}
        </label>
        <select
          id="language"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className={selectClasses}
        >
          {LOCALES.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 font-body cursor-pointer"
        >
          {labels.save}
        </button>
        {saved && (
          <span
            className="text-sm text-success font-body"
            aria-live="polite"
          >
            {labels.saved}
          </span>
        )}
      </div>
    </form>
  );
}
