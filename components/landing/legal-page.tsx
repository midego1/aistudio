"use client";

import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import BlueBlob from "@/components/landing/blobs/blue-blob";
import OrangeBlob from "@/components/landing/blobs/orange-blob";

interface LegalPageProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] overflow-x-hidden">
      <LandingNav />

      <main className="relative isolate flex-1">
         {/* Background Blobs */}
         <div className="absolute top-0 left-0 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
            <BlueBlob className="w-full h-full animate-float-slow" />
         </div>
         <div className="absolute top-[20%] right-[-10%] -z-10 w-[600px] h-[600px] opacity-10 pointer-events-none">
            <OrangeBlob className="w-full h-full animate-pulse-subtle" />
         </div>

        {/* Hero Section */}
        <section className="px-6 pt-12 pb-12 text-center md:pt-20 relative z-10">
          <div className="mx-auto max-w-3xl animate-fade-in-up">
            <h1 className="text-[40px] md:text-[60px] font-bold leading-none tracking-tighter mb-4 text-[#221E68]">
              {title}
            </h1>
            <p className="text-lg text-[#221E68]/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <p className="mt-4 text-sm font-medium text-[#221E68]/50 uppercase tracking-widest">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24 relative z-10">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] p-8 md:p-12 bg-white shadow-xl border border-gray-100 animate-fade-in-up md:delay-100">
            <div
              className="prose prose-lg max-w-none"
              style={
                {
                  "--tw-prose-body": "#221E68cc", // 80% opacity
                  "--tw-prose-headings": "#221E68",
                  "--tw-prose-links": "#F16529",
                  "--tw-prose-bold": "#221E68",
                } as React.CSSProperties
              }
            >
              {children}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="font-bold text-2xl text-[#221E68] tracking-tight mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-[#221E68]/80">
        {children}
      </div>
    </div>
  );
}
