import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const ogDir = join(publicDir, "og");

if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });

// Colors from design system
const PAPER = "#F6F4F0";
const INK = "#0A0A0A";
const ACCENT = "#C2410C";
const MUTED = "#78716C";
const BORDER = "#D6D3D1";

// Taglines per locale
const taglines = {
  default: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  en: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  fr: "Agrandissement d'images par IA. 100% prive. Directement dans votre navigateur.",
  de: "KI Bild Hochskalierer. 100% privat. Lauft in Ihrem Browser.",
  es: "Escalador de imagenes IA. 100% privado. Funciona en tu navegador.",
  pt: "Ampliador de imagens IA. 100% privado. Funciona no seu navegador.",
  ja: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  ko: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  zh: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  ar: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
  hi: "AI Image Upscaler. 100% Private. Runs in Your Browser.",
};

// ============================================================
// OG Images (1200x630)
// ============================================================
function generateOGImage(locale, tagline) {
  const W = 1200;
  const H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  // Accent stripe at top
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, W, 6);

  // Decorative grid dots
  ctx.fillStyle = BORDER;
  for (let x = 80; x < W - 60; x += 40) {
    for (let y = 80; y < H - 60; y += 40) {
      if (Math.random() > 0.85) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Large decorative "U" watermark
  ctx.fillStyle = "#E8E5E0";
  ctx.font = "bold 500px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("U", W - 40, H + 80);

  // Accent geometric element (corner brackets)
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 3;
  // Top left bracket
  ctx.beginPath();
  ctx.moveTo(60, 100);
  ctx.lineTo(60, 60);
  ctx.lineTo(100, 60);
  ctx.stroke();
  // Bottom right bracket
  ctx.beginPath();
  ctx.moveTo(W - 60, H - 100);
  ctx.lineTo(W - 60, H - 60);
  ctx.lineTo(W - 100, H - 60);
  ctx.stroke();

  // Wordmark "Uplocal"
  ctx.fillStyle = INK;
  ctx.font = "400 72px serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Uplocal", 100, 140);

  // Accent dot after wordmark
  const wordWidth = ctx.measureText("Uplocal").width;
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.arc(100 + wordWidth + 16, 178, 8, 0, Math.PI * 2);
  ctx.fill();

  // Divider line
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 240);
  ctx.lineTo(500, 240);
  ctx.stroke();

  // Tagline
  ctx.fillStyle = INK;
  ctx.font = "500 32px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Word wrap tagline
  const maxWidth = W - 250;
  const words = tagline.split(/\s+/);
  let line = "";
  let y = 270;
  const lineHeight = 46;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, 100, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, 100, y);
  }

  // Bottom info bar
  ctx.fillStyle = MUTED;
  ctx.font = "400 18px sans-serif";
  ctx.textBaseline = "bottom";
  ctx.fillText("uplocal.app", 100, H - 50);

  // Bottom accent bar
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, H - 6, W, 6);

  // Scale indicators on the right
  const scales = ["2x", "4x", "8x"];
  scales.forEach((s, i) => {
    const sx = W - 180;
    const sy = 160 + i * 80;
    const isActive = i === 1; // highlight 4x

    ctx.fillStyle = isActive ? ACCENT : BORDER;
    ctx.fillRect(sx, sy, 80, 50);

    ctx.fillStyle = isActive ? "#FFFFFF" : MUTED;
    ctx.font = `${isActive ? "700" : "400"} 22px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s, sx + 40, sy + 25);
  });

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  return canvas.toBuffer("image/png");
}

console.log("Generating OG images...");
for (const [locale, tagline] of Object.entries(taglines)) {
  const filename = `og-${locale}.png`;
  const buffer = generateOGImage(locale, tagline);
  writeFileSync(join(ogDir, filename), buffer);
  console.log(`  ${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
}

// ============================================================
// Favicon and App Icons
// ============================================================

function generateIcon(size, padding = 0.15) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const p = Math.round(size * padding);

  // Background
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, size, size);

  // Accent stripe at top
  const stripeH = Math.max(2, Math.round(size * 0.04));
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, size, stripeH);

  // Letter "U" centered
  ctx.fillStyle = PAPER;
  const fontSize = Math.round(size * 0.55);
  ctx.font = `400 ${fontSize}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("U", size / 2, size / 2 + stripeH / 2 + Math.round(size * 0.03));

  // Small accent dot
  const dotR = Math.max(2, Math.round(size * 0.04));
  ctx.fillStyle = ACCENT;
  const uMetrics = ctx.measureText("U");
  ctx.beginPath();
  ctx.arc(
    size / 2 + uMetrics.width / 2 + dotR + 2,
    size / 2 - fontSize * 0.15,
    dotR,
    0,
    Math.PI * 2
  );
  ctx.fill();

  return canvas.toBuffer("image/png");
}

function generateFavicon32() {
  return generateIcon(32, 0);
}

function generateFavicon16() {
  return generateIcon(16, 0);
}

console.log("\nGenerating icons...");

// favicon.ico components
const icon32 = generateFavicon32();
writeFileSync(join(publicDir, "icon-32.png"), icon32);
console.log("  icon-32.png");

const icon16 = generateFavicon16();
writeFileSync(join(publicDir, "icon-16.png"), icon16);
console.log("  icon-16.png");

// Apple touch icon
const appleIcon = generateIcon(180);
writeFileSync(join(publicDir, "apple-touch-icon.png"), appleIcon);
console.log("  apple-touch-icon.png");

// PWA icons
const icon192 = generateIcon(192);
writeFileSync(join(publicDir, "icon-192.png"), icon192);
console.log("  icon-192.png");

const icon512 = generateIcon(512);
writeFileSync(join(publicDir, "icon-512.png"), icon512);
console.log("  icon-512.png");

// Favicon as PNG (modern browsers)
const favicon = generateIcon(48, 0);
writeFileSync(join(publicDir, "favicon.png"), favicon);
console.log("  favicon.png");

// ============================================================
// SVG Logo
// ============================================================
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" fill="none">
  <rect width="32" height="32" fill="${INK}"/>
  <rect width="32" height="2" fill="${ACCENT}"/>
  <text x="16" y="22" text-anchor="middle" fill="${PAPER}" font-family="serif" font-size="20" font-weight="400">U</text>
  <circle cx="24" cy="11" r="2" fill="${ACCENT}"/>
  <text x="40" y="23" fill="${INK}" font-family="serif" font-size="22" font-weight="400">Uplocal</text>
</svg>`;

writeFileSync(join(publicDir, "logo.svg"), svgLogo);
console.log("  logo.svg");

// SVG Logo mark only
const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" fill="${INK}"/>
  <rect width="32" height="2" fill="${ACCENT}"/>
  <text x="16" y="22" text-anchor="middle" fill="${PAPER}" font-family="serif" font-size="20" font-weight="400">U</text>
  <circle cx="24" cy="11" r="2" fill="${ACCENT}"/>
</svg>`;

writeFileSync(join(publicDir, "mark.svg"), svgMark);
console.log("  mark.svg");

console.log("\nDone! All assets generated.");
