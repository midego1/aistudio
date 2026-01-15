"use client";

import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("landing.footer");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { labelKey: "features", href: "#features" },
      { labelKey: "pricing", href: "/pricing" },
      { labelKey: "help", href: "/help" },
    ],
    company: [
      { labelKey: "about", href: "/about" },
      { labelKey: "blog", href: "/blog" },
      { labelKey: "contact", href: "/contact" },
    ],
    legal: [
      { labelKey: "privacy", href: "/privacy" },
      { labelKey: "terms", href: "/terms" },
    ],
  };

  return (
    <footer
      className="px-6 py-16"
      style={{
        backgroundColor: "var(--landing-bg-alt)",
        borderTop: "1px solid var(--landing-border)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              className="font-semibold tracking-tight"
              href="/"
              style={{ color: "var(--landing-text)" }}
            >
              Proppi
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              Transform your real estate photos with AI-powered enhancements.
              Professional results in seconds.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                aria-label="Follow us on X (Twitter)"
                className="flex size-10 items-center justify-center rounded-full transition-colors hover:opacity-70"
                href="https://twitter.com"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "var(--landing-bg)",
                  border: "1px solid var(--landing-border)",
                }}
                target="_blank"
              >
                <IconBrandX
                  className="size-4"
                  style={{ color: "var(--landing-text)" }}
                />
              </a>
              <a
                aria-label="Follow us on LinkedIn"
                className="flex size-10 items-center justify-center rounded-full transition-colors hover:opacity-70"
                href="https://linkedin.com"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "var(--landing-bg)",
                  border: "1px solid var(--landing-border)",
                }}
                target="_blank"
              >
                <IconBrandLinkedin
                  className="size-4"
                  style={{ color: "var(--landing-text)" }}
                />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "var(--landing-text)" }}
            >
              {t("product")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    className="text-sm transition-colors hover:opacity-70"
                    href={link.href}
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "var(--landing-text)" }}
            >
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    className="text-sm transition-colors hover:opacity-70"
                    href={link.href}
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "var(--landing-text)" }}
            >
              {t("legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    className="text-sm transition-colors hover:opacity-70"
                    href={link.href}
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {t(`links.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--landing-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--landing-text-muted)" }}>
            &copy; {currentYear} Proppi. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
