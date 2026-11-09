import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { LogoWall } from "@/components/sections/LogoWall";
import { CompareBand } from "@/components/sections/CompareBand";
import { Explainer } from "@/components/sections/Explainer";
import { WhatWeCover } from "@/components/sections/WhatWeCover";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { HeatBreak } from "@/components/sections/HeatBreak";
import { FAQ } from "@/components/sections/FAQ";
import { CaseStudy, TalentDirectory, Testimonials } from "@/components/sections/ProofSections";
import { QuickBrief } from "@/components/sections/QuickBrief";
import { GetStarted } from "@/components/onboard/GetStarted";

// 2026-10-27: home rebuilt around the service Andre sells and the outreach
// pitches — "From 500 candidates to 5" — so a click from an email lands on
// page two of that email: promise → proof → how → bench → brief.
const DESCRIPTION =
  "Recruitment for mobile games and consumer apps. We headhunt the people who never see your job ad and hand you 5 screened candidates in 5 working days. from £9,000 per hire.";

export const metadata: Metadata = {
  title: "MakersForge: From 500 candidates to 5 · Mobile games & apps recruitment",
  description: DESCRIPTION,
  openGraph: {
    title: "MakersForge: From 500 candidates to 5",
    description: DESCRIPTION,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel
        headline={["500 candidates to 5."]}
        // 2026-11-09 (Andre): say mobile games and apps up front, and tie it to 500 to 5.
        ledeLead="Hiring in Mobile Games and Apps?"
        lede="We headhunt UA, growth, product, design, art and engineering talent. You get 5 worth hiring, not 500 CVs to sift."
        ctas={{
          // 2026-11-09 (Andre): a 63% bounce rate; a free tool to click first, not "talk to us".
          primary: { href: "/hire-timeline", label: "Will your job ad hire in time?" },
          // PROTOTYPE 2026-11-02: self-onboarding replaces the call; the hero links go (Andre).
          secondary: { href: "/start", label: "Get started" },
        }}
      />
      {/* 2026-10-27 flow: outcome → how → proof → why not an ad → bench
          → roles → doubts → brief. Comparison table lives on /pricing. */}
      <CompareBand />
      <LogoWall />
      <HowItWorksBento />
      <CaseStudy />
      <Testimonials />
      <HeatBreak />
      <Explainer />
      <TalentDirectory />
      <WhatWeCover title="Who we hire for." />
      <HeatBreak />
      <QuickBrief />
      <GetStarted />
      <FAQ />
    </>
  );
}
