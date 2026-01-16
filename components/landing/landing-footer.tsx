"use client";

import { Link as LocalizedLink } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("landing.newFooter");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#221E68] pt-32 pb-16 relative overflow-hidden mt-12 text-white">
      {/* Wave Decoration - SVG approximation */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[100px] w-full fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-[24px] md:text-[32px] font-bold text-white mb-8">
          {t("title")}
        </h2>

        <p className="text-white/60 max-w-lg mx-auto mb-12">
          {t("description")}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-medium mb-8">
          <LocalizedLink
            href="/#pricing"
            className="hover:text-white transition-colors"
          >
            {t("pricing")}
          </LocalizedLink>
          <LocalizedLink
            href="/#features"
            className="hover:text-white transition-colors"
          >
            {t("features")}
          </LocalizedLink>
          <LocalizedLink
            href="/about"
            className="hover:text-white transition-colors"
          >
            {t("aboutUs")}
          </LocalizedLink>
          <LocalizedLink
            href="/contact"
            className="hover:text-white transition-colors"
          >
            {t("contact")}
          </LocalizedLink>
          <LocalizedLink
            href="/privacy"
            className="hover:text-white transition-colors"
          >
            {t("privacy")}
          </LocalizedLink>
          <LocalizedLink
            href="/terms"
            className="hover:text-white transition-colors"
          >
            {t("terms")}
          </LocalizedLink>
        </div>

        <div className="text-white/40 text-xs">
          © {currentYear} VastgoedFotoAI.nl. {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
