"use client";

import { useState } from "react";
import { ArrowRight, Check, Zap, Sofa, ShieldCheck, Sparkles, Clock, DollarSign, Plus, Minus } from "lucide-react";
import OrangeBlob from "@/components/landing/blobs/orange-blob";
import BlueBlob from "@/components/landing/blobs/blue-blob";
import RedBlob from "@/components/landing/blobs/red-blob";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslations } from "next-intl";
import { Link as LocalizedLink } from "@/i18n/routing";

function FaqItem({ questionKey }: { questionKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("pricing.faq");

  return (
    <div
      className="rounded-xl transition-all border border-gray-100 bg-white shadow-sm"
    >
      <button
        className="flex w-full items-center justify-between p-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="pr-8 font-bold text-lg text-[#221E68]">
          {t(`${questionKey}.question`)}
        </span>
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            isOpen ? "bg-[#221E68] text-white" : "bg-gray-100 text-[#221E68]"
          }`}
        >
          {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-[#221E68]/70 leading-relaxed text-base">
          {t(`${questionKey}.answer`)}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const t = useTranslations("landing");
  const tNav = useTranslations("nav");

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden bg-white pt-[88px]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center text-[#221E68] text-sm font-medium">
          <LocalizedLink href="/" className="text-xl font-bold text-[#221E68] hover:opacity-80 transition-opacity">
            VastgoedFotoAI.nl
          </LocalizedLink>
          <div className="flex items-center gap-8">
            <LanguageSelector />
            <LocalizedLink href="#pricing" className="hover:opacity-70 transition-opacity">{tNav("pricing")}</LocalizedLink>
            <LocalizedLink href="#features" className="hover:opacity-70 transition-opacity">{tNav("features")}</LocalizedLink>
            <LocalizedLink href="/sign-in" className="hover:opacity-70 transition-opacity">{tNav("signIn")}</LocalizedLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-[1240px] px-6 pt-10 pb-20 flex flex-col items-center text-center relative z-10">
        
        {/* Logo/Title */}
        <h1 className="text-[50px] md:text-[80px] font-bold leading-none tracking-tighter mb-6 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#F16529] via-[#E7385E] to-[#221E68] max-w-4xl">
          {t("newHero.title")}
        </h1>
        
        <h2 className="text-[24px] md:text-[32px] font-bold mb-6 max-w-2xl leading-tight text-[#221E68] relative z-10">
          {t("newHero.subtitle")}
        </h2>
        
        <p className="text-[16px] md:text-[18px] text-[#221E68] font-bold mb-8 relative z-10 opacity-80">
          {t("newHero.socialProof")}
        </p>

        {/* Primary Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 relative z-10">
             <LocalizedLink href="/dashboard" className="bg-[#221E68] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#221E68]/90 transition-all shadow-lg flex items-center justify-center gap-3 min-w-[200px]">
                <Sparkles size={20} />
                {t("newHero.ctaPrimary")}
            </LocalizedLink>
             <LocalizedLink href="#pricing" className="bg-white text-[#221E68] border-2 border-[#221E68]/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-3 min-w-[200px]">
                {t("newHero.ctaSecondary")}
            </LocalizedLink>
        </div>
        
        <p className="text-sm text-[#E7385E] font-bold mb-8 relative z-10">
            {t("newHero.launchOffer")}
        </p>

        <div className="animate-bounce mt-8 text-[#E7385E]">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>

      </section>

      {/* Section 1: AI Enhancement (Orange Blob) */}
      <section id="features" className="w-full max-w-[1240px] px-6 py-24 flex flex-col md:flex-row items-center gap-12 md:gap-32 relative overflow-hidden md:overflow-visible isolate">
          {/* Orange Rings Background */}
         <div className="absolute top-1/2 right-[-45%] w-[1000px] h-[1000px] -z-10 translate-y-[-50%] pointer-events-none hidden md:block animate-spin-slower">
            <OrangeBlob className="w-full h-full" />
         </div>
         {/* Mobile version of background */}
          <div className="absolute top-1/2 right-[-50%] w-[80%] h-[150%] bg-[#F7931E] rounded-l-full opacity-10 blur-3xl -z-10 translate-y-[-20%] md:hidden animate-pulse-subtle"></div>

        <div className="flex-1 order-2 md:order-1 relative">
             <div className="relative w-full max-w-md mx-auto aspect-[4/3]">
                 {/* Visual: Image Enhancement Mockup */}
                  <div className="bg-white rounded-[2rem] shadow-2xl p-4 border border-gray-100 relative z-20 h-full flex flex-col">
                     <div className="flex items-center justify-between mb-4 px-2">
                         <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                         </div>
                         <div className="text-xs font-bold text-[#F16529] bg-[#F16529]/10 px-3 py-1 rounded-full">AI Processing</div>
                     </div>
                     <div className="flex-1 bg-gray-100 rounded-xl relative overflow-hidden group">
                        {/* Placeholder for standard image */}
                        <div className="absolute inset-0 bg-gray-400 flex items-center justify-center text-white font-bold text-xl">Before</div>
                         {/* Placeholder for enhanced image with clip-path for slider effect */}
                         <div className="absolute inset-0 bg-gradient-to-br from-[#221E68] to-[#27A9E1] flex items-center justify-center text-white font-bold text-xl" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}>After</div>
                         
                         {/* Slider Line */}
                         <div className="absolute inset-y-0 left-1/2 w-1 bg-white cursor-ew-resize">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#221E68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                             </div>
                         </div>
                     </div>
                  </div>
             </div>
        </div>
        <div className="flex-1 order-1 md:order-2">
            <h3 className="text-[32px] md:text-[50px] font-bold mb-6 leading-tight text-[#221E68]">
                {t("section1.title")}<br/>{t("section1.titleAccent")}
            </h3>
            <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-6">
                {t("section1.description")}
            </p>
            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F16529]/10 flex items-center justify-center text-[#F16529]">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-lg font-medium text-[#221E68]">{t("section1.feature1")}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F16529]/10 flex items-center justify-center text-[#F16529]">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-lg font-medium text-[#221E68]">{t("section1.feature2")}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F16529]/10 flex items-center justify-center text-[#F16529]">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-lg font-medium text-[#221E68]">{t("section1.feature3")}</span>
                </div>
            </div>
             <LocalizedLink href="#features" className="font-bold text-[#F16529] hover:underline flex items-center gap-2">
                {t("section1.cta")} <ArrowRight size={18} />
             </LocalizedLink>
        </div>
      </section>

      {/* Section 2: Speed (Blue Blob) */}
      <section className="w-full max-w-[1240px] px-6 py-24 flex flex-col md:flex-row items-center gap-12 md:gap-32 relative overflow-hidden md:overflow-visible isolate">
          {/* Blue/Green Curves Background */}
           <div className="absolute top-1/2 left-[-45%] w-[1000px] h-[1000px] -z-10 translate-y-[-50%] pointer-events-none hidden md:block animate-float-slow">
              <BlueBlob className="w-full h-full opacity-30" />
           </div>
           {/* Mobile version */}
           <div className="absolute top-1/2 left-[-20%] w-[80%] h-[150%] bg-[#27A9E1] rounded-r-full opacity-10 blur-3xl -z-10 translate-y-[-20%] md:hidden animate-pulse-subtle"></div>

        <div className="flex-1">
            <h3 className="text-[32px] md:text-[50px] font-bold mb-6 leading-tight text-[#221E68]">
                {t("section2.title")}<br />{t("section2.titleAccent")}
            </h3>
            <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-6">
                {t("section2.description")}
            </p>
             <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-6">
                <strong>{t("section2.batchDescription")}</strong> {t("section2.batchDescriptionSuffix")}
            </p>
             <LocalizedLink href="#pricing" className="font-bold text-[#221E68] hover:underline flex items-center gap-2">
                {t("section2.cta")} <ArrowRight size={18} />
             </LocalizedLink>
        </div>
         <div className="flex-1 relative">
             <div className="relative w-full max-w-md mx-auto">
                 {/* Visual: Speedometer/Processing */}
                  <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 flex flex-col items-center">
                      <div className="flex items-center gap-2 text-gray-400 font-medium mb-8">
                          <Zap size={20} className="text-[#F16529]" fill="currentColor" />
                          <span>{t("section2.processingSpeed")}</span>
                      </div>
                      
                      <div className="relative w-64 h-64 mb-8">
                           {/* Outer ring */}
                           <div className="absolute inset-0 border-[24px] border-[#F16529] rounded-full"></div>
                           
                           {/* Center content */}
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold text-[#221E68]">30<span className="text-2xl text-[#ccc]">s</span></span>
                                <span className="text-sm font-bold text-gray-400 mt-2">{t("section2.perImage")}</span>
                           </div>
                      </div>
                      
                      <div className="w-full bg-green-50 rounded-xl p-4 flex items-center justify-center">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                  <Check size={16} strokeWidth={3} />
                              </div>
                              <span className="font-bold text-green-700">{t("section2.photoLimit")}</span>
                          </div>
                      </div>
                  </div>
             </div>
        </div>
      </section>

      {/* Section 3: Virtual Staging (Red Blob) */}
       <section className="w-full max-w-[1240px] px-6 py-24 flex flex-col md:flex-row items-center gap-12 md:gap-32 relative overflow-hidden md:overflow-visible isolate">
             {/* Red/Orange Blob */}
           <div className="absolute top-1/2 right-[-45%] w-[1000px] h-[1000px] -z-10 translate-y-[-50%] pointer-events-none hidden md:block animate-spin-slower">
                 <RedBlob className="w-full h-full opacity-40" />
           </div>
           {/* Mobile */}
           <div className="absolute top-1/2 right-[-20%] w-[80%] h-[150%] bg-[#E7385E] rounded-l-full opacity-10 blur-3xl -z-10 translate-y-[-20%] md:hidden animate-pulse-subtle"></div>

        <div className="flex-1 order-2 md:order-1 relative">
             {/* Visual: Virtual Staging Mockup */}
              <div className="bg-white rounded-[2rem] shadow-xl p-8 max-w-md mx-auto border border-gray-100">
                   <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#E7385E]/10 flex items-center justify-center text-[#E7385E]">
                            <Sofa size={24} />
                        </div>
                        <div>
                             <div className="font-bold text-[#221E68] text-lg">{t("section3.virtualStaging")}</div>
                             <div className="text-xs text-green-500 font-bold uppercase tracking-wider">{t("section3.availableNow")}</div>
                        </div>
                   </div>
                   
                   <div className="space-y-4">
                        {/* Style Selector Mockup */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                             <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 border-2 border-[#221E68] relative overflow-hidden">
                                 <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#221E68]">Scandi</div>
                             </div>
                              <div className="w-20 h-20 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">Modern</div>
                              <div className="w-20 h-20 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">Industrial</div>
                        </div>
                        
                        <div className="h-32 bg-gradient-to-br from-[#f5f0eb] to-[#e8dfd6] rounded-xl w-full flex items-center justify-center border border-gray-200">
                             <span className="text-sm font-medium text-[#221E68]">{t("section3.scandiActive")}</span>
                        </div>
                   </div>
              </div>
        </div>
        <div className="flex-1 order-1 md:order-2">
            <h3 className="text-[32px] md:text-[50px] font-bold mb-6 leading-tight text-[#221E68]">
                {t("section3.title")}<br/>{t("section3.titleAccent")}
            </h3>
            <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-6">
                {t("section3.description")}
            </p>
             <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-6">
                <strong>{t("section3.moreStyles")}</strong> {t("section3.moreStylesList")}
            </p>
        </div>
      </section>

      {/* Section 4: Comparison Chart */}
      <section id="pricing" className="w-full bg-[#f8f8fa] text-center pt-24 pb-32">
            <h3 className="text-[32px] md:text-[50px] font-bold mb-4 text-[#221E68]">
               {t("comparison.title")}
            </h3>
             <p className="text-[18px] md:text-[21px] text-[#221E68]/80 leading-relaxed mb-16 max-w-3xl mx-auto px-6">
               {t("comparison.subtitle")}
            </p>

            <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Card 1: Time */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                          <Clock size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-[#221E68] mb-2">{t("comparison.card1Title")}</h4>
                      <p className="text-3xl font-bold text-[#221E68] mb-2">{t("comparison.card1Value")} <span className="text-lg font-normal text-gray-400">{t("comparison.card1Comparison")}</span></p>
                      <p className="text-sm text-gray-500">{t("comparison.card1Description")}</p>
                 </div>
                 
                  {/* Card 2: Cost */}
                 <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#F16529]/20 flex flex-col items-center relative transform md:-translate-y-4">
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#F16529] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {t("comparison.card2Badge")}
                      </div>
                      <div className="w-16 h-16 bg-[#F16529]/10 text-[#F16529] rounded-full flex items-center justify-center mb-6">
                          <DollarSign size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-[#221E68] mb-2">{t("comparison.card2Title")}</h4>
                      <p className="text-3xl font-bold text-[#221E68] mb-2">{t("comparison.card2Value")} <span className="text-lg font-normal text-gray-400">{t("comparison.card2Comparison")}</span></p>
                      <p className="text-sm text-gray-500">{t("comparison.card2Description")}</p>
                 </div>
                 
                  {/* Card 3: Quality */}
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                          <ShieldCheck size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-[#221E68] mb-2">{t("comparison.card3Title")}</h4>
                      <p className="text-3xl font-bold text-[#221E68] mb-2">{t("comparison.card3Value")} <span className="text-lg font-normal text-gray-400">{t("comparison.card3Comparison")}</span></p>
                      <p className="text-sm text-gray-500">{t("comparison.card3Description")}</p>
                 </div>
            </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-[1240px] px-6 py-24 mb-12">
          <div className="text-center mb-16">
              <h2 className="text-[32px] md:text-[50px] font-bold text-[#221E68] mb-4">
                  {t("faq.title")}
              </h2>
              <p className="text-[18px] md:text-[21px] text-[#221E68]/80 max-w-2xl mx-auto">
                  {t("faq.subtitle")}
              </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
              {["q1", "q2", "q3", "q4", "q5", "q6"].map((faqKey) => (
                  <FaqItem key={faqKey} questionKey={faqKey} />
              ))}
          </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#221E68] pt-32 pb-16 relative overflow-hidden mt-12 text-white">
           {/* Wave Decoration - SVG approximation */}
           <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[100px] w-full fill-white">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
           </div>
           
          <div className="w-full max-w-[1240px] mx-auto px-6 text-center relative z-10">

              
              <h2 className="text-[24px] md:text-[32px] font-bold text-white mb-8">
                  {t("newFooter.title")}
              </h2>
               
               <p className="text-white/60 max-w-lg mx-auto mb-12">
                   {t("newFooter.description")}
               </p>

               <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-medium mb-8">
                   <LocalizedLink href="#pricing" className="hover:text-white transition-colors">{t("newFooter.pricing")}</LocalizedLink>
                   <LocalizedLink href="#features" className="hover:text-white transition-colors">{t("newFooter.features")}</LocalizedLink>
                   <LocalizedLink href="/about" className="hover:text-white transition-colors">{t("newFooter.aboutUs")}</LocalizedLink>
                   <LocalizedLink href="/contact" className="hover:text-white transition-colors">{t("newFooter.contact")}</LocalizedLink>
                   <LocalizedLink href="/privacy" className="hover:text-white transition-colors">{t("newFooter.privacy")}</LocalizedLink>
                   <LocalizedLink href="/terms" className="hover:text-white transition-colors">{t("newFooter.terms")}</LocalizedLink>
               </div>

                <div className="text-white/40 text-xs">
                    © {new Date().getFullYear()} VastgoedFotoAI.nl. {t("newFooter.copyright")}
                </div>
          </div>
          

      </footer>
    </div>
  );
}
