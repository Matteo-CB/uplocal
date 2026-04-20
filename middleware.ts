import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  if (pathname.startsWith("/api/")) {
    return;
  }

  
  
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

  
  
  
  const response = intlMiddleware(request);

  
  
  
  if (response && request.cookies.get("NEXT_LOCALE")) {
    response.cookies.delete("NEXT_LOCALE");
  }

  return response ?? NextResponse.next();
}

export const config = {
  
  
  
  matcher: [
    "/",
    "/((?!api|_next|_vercel|wasm|models|fonts|og|manifest\\.json|favicon\\.png|icon-.*|apple-touch-icon\\.png|logo\\.svg|mark\\.svg|.*\\..*).*)",
  ],
};
