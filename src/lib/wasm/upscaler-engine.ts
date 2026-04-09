// This file is kept for reference but the actual upscaling
// is now handled by UpscalerJS (TensorFlow.js + ESRGAN models)
// via the useUpscaler hook in src/hooks/useUpscaler.ts
//
// UpscalerJS runs entirely in the browser using WebGL/WebGPU,
// no WASM compilation needed. Models are downloaded on first use
// and cached in the browser automatically.

export {};
