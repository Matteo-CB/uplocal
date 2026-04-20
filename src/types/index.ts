export type Locale =
  | "en"
  | "fr"
  | "de"
  | "es"
  | "pt"
  | "ja"
  | "ko"
  | "zh"
  | "ar"
  | "hi";

export const locales: Locale[] = [
  "en",
  "fr",
  "de",
  "es",
  "pt",
  "ja",
  "ko",
  "zh",
  "ar",
  "hi",
];

export const rtlLocales: Locale[] = ["ar"];

export type Plan = "FREE" | "PRO" | "STUDIO";

export type OutputFormat = "png" | "jpeg" | "webp";

export interface UsageStatus {
  canUpscale: boolean;
  remainingToday: number;
  maxScale: number;
  maxFileSize: number;
  batchLimit: number;
  plan: Plan;
  allowedFormats: OutputFormat[];
  customDimensions: boolean;
  patchSize: number;
}
