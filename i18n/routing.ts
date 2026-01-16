import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "nl"],

  // Used when no locale matches
  defaultLocale: "nl",

  // The locale prefix strategy
  // 'as-needed': Only add prefix for non-default locale
  localePrefix: "as-needed",
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
