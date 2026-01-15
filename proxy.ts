import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

/**
 * Next.js Proxy (formerly Middleware).
 *
 * Handles:
 * 1. Internationalization (i18n) routing
 * 2. Authentication checks for protected routes
 */
export function proxy(request: NextRequest) {
  // First, handle i18n routing
  const response = intlMiddleware(request);

  // For protected routes, check authentication
  if (request.nextUrl.pathname.includes("/dashboard")) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (with extensions)
  // - Next.js internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
