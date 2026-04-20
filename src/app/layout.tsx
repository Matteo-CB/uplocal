import type { ReactNode } from "react";
import type { Metadata } from "next";
import { instrumentSerif, satoshi, jetbrainsMono } from "@/lib/fonts";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=document.cookie.match(/theme=([^;]+)/);var theme=t?t[1]:(localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));document.documentElement.setAttribute('data-theme',theme)}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${satoshi.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
