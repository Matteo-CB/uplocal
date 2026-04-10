import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never touch API routes, especially auth
  if (pathname.startsWith("/api/")) {
    return;
  }

  // Skip Next internals and static asset paths defensively (the matcher
  // should already exclude these, but this guards against edge cases).
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.startsWith("/wasm/") ||
    pathname.startsWith("/models/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og/")
  ) {
    return;
  }

  // Run next-intl for everything else, including "/". This handles locale
  // detection from the Accept-Language header and redirects to the correct
  // /{locale}/... path.
  const response = intlMiddleware(request);

  // Defensive cleanup: if a stale NEXT_LOCALE cookie exists (from a previous
  // deploy where localeCookie was enabled), strip it so detection is not
  // permanently locked to whatever value was first written.
  if (response && request.cookies.get("NEXT_LOCALE")) {
    response.cookies.delete("NEXT_LOCALE");
  }

  return response ?? NextResponse.next();
}

export const config = {
  // Match every request path except Next internals, static assets and files
  // with an extension. Crucially, "/" must be matched so the root URL gets
  // locale-detected and redirected to /{locale}/.
  matcher: [
    "/",
    "/((?!api|_next|_vercel|wasm|models|fonts|og|manifest\\.json|favicon\\.png|icon-.*|apple-touch-icon\\.png|logo\\.svg|mark\\.svg|.*\\..*).*)",
  ],
};
