"use client";

import {
  IconHeart,
  IconRocket,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import OrangeBlob from "@/components/landing/blobs/orange-blob";
import BlueBlob from "@/components/landing/blobs/blue-blob";
import RedBlob from "@/components/landing/blobs/red-blob";

export function AboutPage() {
  const t = useTranslations("about");

  const values = [
    {
      icon: IconSparkles,
      titleKey: "qualityFirst",
    },
    {
      icon: IconRocket,
      titleKey: "speedMatters",
    },
    {
      icon: IconHeart,
      titleKey: "builtForYou",
    },
    {
      icon: IconTarget,
      titleKey: "simplePricing",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] overflow-x-hidden">
      <LandingNav />

      <main className="relative isolate flex-1">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
          <OrangeBlob className="w-full h-full animate-spin-slower" />
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/4 w-[600px] h-[600px] opacity-20 pointer-events-none">
          <BlueBlob className="w-full h-full animate-float-slow" />
        </div>

        {/* Hero Section */}
        <section className="px-6 pt-12 pb-16 text-center md:pt-20 md:pb-24 relative z-10">
          <div className="mx-auto max-w-3xl animate-fade-in-up">
            <p className="font-bold text-sm uppercase tracking-wider text-[#E7385E] mb-3">
              {t("badge")}
            </p>
            <h1 className="text-[40px] md:text-[60px] font-bold leading-none tracking-tighter mb-6 text-[#221E68]">
              {t("title")}
            </h1>
            <p className="text-lg leading-relaxed md:text-xl text-[#221E68]/80">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="px-6 pb-24 relative z-10">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] p-8 md:p-12 bg-white shadow-xl border border-gray-100 animate-fade-in-up md:delay-100">
            <h2 className="font-bold text-2xl tracking-tight sm:text-3xl text-[#221E68] mb-6">
              {t("story.title")}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-[#221E68]/70">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p>{t("story.p3")}</p>
              <p>{t("story.p4")}</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6 py-24 bg-[#f8f8fa] relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-5 pointer-events-none">
             <RedBlob className="w-full h-full animate-pulse-subtle" />
           </div>

          <div className="mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <p className="font-bold text-sm uppercase tracking-wider text-[#F16529] mb-3">
                {t("values.badge")}
              </p>
              <h2 className="text-[32px] md:text-[48px] font-bold text-[#221E68]">
                {t("values.title")}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {values.map((value, index) => (
                <div
                  className="rounded-[2rem] p-8 bg-white border border-gray-100 shadow-lg transition-transform hover:-translate-y-1 duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  key={value.titleKey}
                >
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-[#221E68]/5 text-[#221E68]">
                    <value.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-xl text-[#221E68] mb-3">
                    {t(`values.${value.titleKey}.title`)}
                  </h3>
                  <p className="text-[#221E68]/70 leading-relaxed">
                    {t(`values.${value.titleKey}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 py-24 relative overflow-hidden">
           <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] opacity-10 pointer-events-none">
              <OrangeBlob className="w-full h-full animate-float-slow" />
           </div>

          <div className="mx-auto max-w-3xl text-center relative z-10 animate-fade-in-up">
            <p className="font-bold text-sm uppercase tracking-wider text-[#221E68]/60 mb-3">
              {t("mission.badge")}
            </p>
            <h2 className="text-[32px] md:text-[48px] font-bold text-[#221E68] mb-6">
              {t("mission.title")}
            </h2>
            <p className="text-lg leading-relaxed text-[#221E68]/80">
              {t("mission.description")}
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-4xl rounded-[3rem] px-8 py-16 text-center md:px-16 bg-[#221E68] text-white shadow-2xl relative overflow-hidden animate-scale-in">
             {/* Abstract Shapes/Blobs for CTA background */}
             <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                 <BlueBlob className="absolute -top-1/2 -left-1/2 w-full h-full mix-blend-overlay" />
                 <RedBlob className="absolute -bottom-1/2 -right-1/2 w-full h-full mix-blend-overlay" />
             </div>

            <div className="relative z-10">
                <h2 className="font-bold text-3xl tracking-tight sm:text-4xl text-white mb-4">
                {t("cta.title")}
                </h2>
                <p className="mx-auto max-w-lg text-lg leading-relaxed text-white/80 mb-8">
                {t("cta.subtitle")}
                </p>
                <a
                className="inline-flex h-14 items-center rounded-full px-10 font-bold text-lg transition-all duration-200 hover:scale-[1.03] bg-white text-[#221E68] hover:bg-gray-50 shadow-lg"
                href="/contact"
                >
                {t("cta.button")}
                </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
