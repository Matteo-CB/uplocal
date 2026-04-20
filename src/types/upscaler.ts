export type UpscalerState =
  | "idle"
  | "loading-model"
  | "processing"
  | "complete"
  | "error";

export type Scale = 2 | 4 | 8;

export type OutputFormat = "png" | "jpeg" | "webp";

export interface ProcessOptions {
  scale: Scale;
  outputFormat: OutputFormat;
  quality: number;
  tileSize: number;
  tileOverlap: number;
}

export interface ProcessStats {
  inputWidth: number;
  inputHeight: number;
  outputWidth: number;
  outputHeight: number;
  processingTimeMs: number;
  tilesProcessed: number;
}

export type WorkerInMessage =
  | { type: "init"; scale: Scale }
  | { type: "process"; imageData: ImageData; options: ProcessOptions };

export type WorkerOutMessage =
  | { type: "ready" }
  | { type: "progress"; percent: number }
  | { type: "result"; imageData: ImageData; stats: ProcessStats }
  | { type: "error"; message: string };

export interface UpscaleResult {
  imageUrl: string;
  stats: ProcessStats;
}
