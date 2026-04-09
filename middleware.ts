import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Never touch API routes, especially auth
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|fr|de|es|pt|ja|ko|zh|ar|hi)/:path*",
    "/((?!api|_next|_vercel|wasm|models|fonts|og|manifest\\.json|favicon\\.png|icon-.*|apple-touch-icon\\.png|logo\\.svg|mark\\.svg|.*\\..*).*)",
  ],
};
