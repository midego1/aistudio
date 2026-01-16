"use client";

import { IconClock, IconMail, IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import BlueBlob from "@/components/landing/blobs/blue-blob";
import OrangeBlob from "@/components/landing/blobs/orange-blob";
import RedBlob from "@/components/landing/blobs/red-blob";

export function ContactPage() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

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
        <section className="px-6 pt-12 pb-12 text-center md:pt-20 md:pb-16 relative z-10">
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

        {/* Contact Form & Info */}
        <section className="px-6 pb-24 relative z-10">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2 animate-fade-in-up md:delay-100">
              <form
                className="rounded-[2.5rem] p-8 md:p-12 bg-white shadow-xl border border-gray-100 relative overflow-hidden"
                onSubmit={handleSubmit}
              >
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-5 pointer-events-none -translate-y-1/2 translate-x-1/2">
                    <RedBlob className="w-full h-full" />
                 </div>

                <div className="grid gap-6 sm:grid-cols-2 relative z-10">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      className="text-sm font-bold text-[#221E68] ml-1"
                      htmlFor="name"
                    >
                      {t("form.name")}
                    </label>
                    <input
                      className="h-14 w-full rounded-2xl px-5 text-base outline-none transition-all focus:ring-2 focus:ring-[#221E68]/20 bg-[#f8f8fa] border-transparent text-[#221E68] placeholder:text-[#221E68]/40"
                      id="name"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("form.namePlaceholder")}
                      required
                      type="text"
                      value={formData.name}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      className="text-sm font-bold text-[#221E68] ml-1"
                      htmlFor="email"
                    >
                      {t("form.email")}
                    </label>
                    <input
                      className="h-14 w-full rounded-2xl px-5 text-base outline-none transition-all focus:ring-2 focus:ring-[#221E68]/20 bg-[#f8f8fa] border-transparent text-[#221E68] placeholder:text-[#221E68]/40"
                      id="email"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("form.emailPlaceholder")}
                      required
                      type="email"
                      value={formData.email}
                    />
                  </div>
                </div>

                {/* Topic */}
                <div className="mt-6 space-y-2 relative z-10">
                  <label
                    className="text-sm font-bold text-[#221E68] ml-1"
                    htmlFor="topic"
                  >
                    {t("form.topic")}
                  </label>
                  <div className="relative">
                    <select
                      className="h-14 w-full rounded-2xl px-5 text-base outline-none transition-all focus:ring-2 focus:ring-[#221E68]/20 bg-[#f8f8fa] border-transparent text-[#221E68] appearance-none cursor-pointer"
                      id="topic"
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      required
                      value={formData.topic}
                    >
                      <option disabled value="">
                        {t("form.topicPlaceholder")}
                      </option>
                      <option value="general">{t("topics.general")}</option>
                      <option value="support">{t("topics.support")}</option>
                      <option value="sales">{t("topics.sales")}</option>
                      <option value="partnership">{t("topics.partnership")}</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#221E68]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6 space-y-2 relative z-10">
                  <label
                    className="text-sm font-bold text-[#221E68] ml-1"
                    htmlFor="message"
                  >
                    {t("form.message")}
                  </label>
                  <textarea
                    className="w-full rounded-2xl px-5 py-4 text-base outline-none transition-all focus:ring-2 focus:ring-[#221E68]/20 bg-[#f8f8fa] border-transparent text-[#221E68] placeholder:text-[#221E68]/40 min-h-[150px] resize-none"
                    id="message"
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={t("form.messagePlaceholder")}
                    required
                    value={formData.message}
                  />
                </div>

                {/* Submit */}
                <div className="mt-8 relative z-10">
                    <button
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full font-bold text-lg transition-all duration-200 hover:scale-[1.02] sm:w-auto sm:px-10 bg-[#F16529] text-white shadow-lg shadow-[#F16529]/20 hover:shadow-[#F16529]/30"
                    type="submit"
                    >
                    {t("form.submit")}
                    <IconSend className="size-5" />
                    </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 lg:pt-8 animate-fade-in-up md:delay-200">
              <div
                className="rounded-[2rem] p-8 bg-white border border-gray-100 shadow-lg transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-[#221E68]/5 text-[#221E68]">
                  <IconMail className="size-7" />
                </div>
                <h3 className="font-bold text-xl text-[#221E68] mb-1">
                  {t("info.emailUs")}
                </h3>
                <a href="mailto:hello@vastgoedfotoai.nl" className="text-[#221E68]/70 hover:text-[#F16529] transition-colors">
                  hello@vastgoedfotoai.nl
                </a>
              </div>

              <div
                className="rounded-[2rem] p-8 bg-white border border-gray-100 shadow-lg transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-[#221E68]/5 text-[#221E68]">
                  <IconClock className="size-7" />
                </div>
                <h3 className="font-bold text-xl text-[#221E68] mb-1">
                  {t("info.responseTime")}
                </h3>
                <p className="text-[#221E68]/70 leading-relaxed">
                  {t("info.responseDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
