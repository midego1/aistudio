"use client";

import { LanguageSelector } from "@/components/language-selector";
import { Link as LocalizedLink } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function LandingNav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100/50">
      <div className="w-full max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center text-[#221E68] text-sm font-medium">
        <LocalizedLink
          href="/"
          className="text-xl font-bold text-[#221E68] hover:opacity-80 transition-opacity"
        >
          VastgoedFotoAI.nl
        </LocalizedLink>
        <div className="flex items-center gap-8">
          <div className="mt-[1px]">
            <LanguageSelector />
          </div>
          <LocalizedLink
            href="/#pricing"
            className="hover:opacity-70 transition-opacity"
          >
            {t("pricing")}
          </LocalizedLink>
          <LocalizedLink
            href="/#features"
            className="hover:opacity-70 transition-opacity"
          >
            {t("features")}
          </LocalizedLink>
          <LocalizedLink
            href="/sign-in"
            className="hover:opacity-70 transition-opacity"
          >
            {t("signIn")}
          </LocalizedLink>
        </div>
      </div>
    </nav>
  );
}
