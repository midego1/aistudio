"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

function CtaAuthButton() {
  const { data: session, isPending } = useSession();
  const t = useTranslations("landing.cta");

  if (isPending) {
    return (
      <div
        className="h-14 w-48 animate-pulse rounded-full"
        style={{ backgroundColor: "var(--landing-border)" }}
      />
    );
  }

  const href = session ? "/dashboard" : "/sign-in";
  const text = t("button");

  return (
    <Link
      className="inline-flex h-14 items-center gap-2.5 rounded-full px-8 font-semibold text-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
      href={href}
      style={{
        backgroundColor: "var(--landing-card)",
        color: "var(--landing-text)",
        boxShadow: "0 8px 32px -8px var(--landing-shadow)",
      }}
    >
      {text}
      <IconArrowRight className="size-5" />
    </Link>
  );
}

export function LandingCta() {
  const t = useTranslations("landing.cta");

  return (
    <section
      className="relative overflow-hidden px-6 py-24 md:py-32"
      id="pricing"
      style={{ backgroundColor: "var(--landing-accent)" }}
    >
      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full"
        style={{
          backgroundColor: "var(--landing-accent-foreground)",
          opacity: 0.05,
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full"
        style={{
          backgroundColor: "var(--landing-accent-foreground)",
          opacity: 0.05,
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2
          className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
          style={{ color: "var(--landing-accent-foreground)" }}
        >
          {t("title")}
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
          style={{
            color: "var(--landing-accent-foreground)",
            opacity: 0.85,
          }}
        >
          {t("subtitle")}
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Suspense
            fallback={
              <div
                className="mx-auto h-14 w-48 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--landing-border)" }}
              />
            }
          >
            <CtaAuthButton />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
