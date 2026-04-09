"use client";

import dynamic from "next/dynamic";

const UpscalerCanvas = dynamic(
  () =>
    import("@/components/upscaler/UpscalerCanvas").then(
      (mod) => mod.UpscalerCanvas
    ),
  { ssr: false }
);

export function UpscalerCanvasLoader() {
  return <UpscalerCanvas />;
}
