"use client";

import { useParams } from "next/navigation";
import { routing, usePathname, useRouter } from "@/i18n/routing";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => handleLocaleChange("nl")}
        className={`px-2 py-0.5 rounded transition-colors ${
          currentLocale === "nl"
            ? "text-[var(--landing-text)] font-semibold"
            : "text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]"
        }`}
        type="button"
      >
        NL
      </button>
      <span className="text-[var(--landing-text-muted)]">/</span>
      <button
        onClick={() => handleLocaleChange("en")}
        className={`px-2 py-0.5 rounded transition-colors ${
          currentLocale === "en"
            ? "text-[var(--landing-text)] font-semibold"
            : "text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]"
        }`}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
