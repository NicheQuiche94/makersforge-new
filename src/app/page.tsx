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

/* MOCKUP 2026-11-09 (Andre): the hero never said mobile games and apps. ?hero=1..4 previews options; no param = today's live hero. */
const HERO_OPTIONS: Record<string, { ledeLead: string; lede: string; badge?: string; chips?: string[] }> = {
  "1": {
    ledeLead: "Hiring for mobile games and apps?",
    lede: "We headhunt UA, growth, product, design and engineering talent, and hand you 5 you'd want to hire within 5 working days.",
  },
  "2": {
    ledeLead: "Hiring for mobile games and apps?",
    lede: "We headhunt the people who never see your job ad, and hand you 5 within 5 working days.",
    chips: ["UA & Growth", "Product", "Game design", "Art", "Engineering", "LiveOps"],
  },
  "3": {
    ledeLead: "All vetted, all worth interviewing.",
    lede: "Hiring for mobile games and consumer apps.",
  },
  "4": {
    badge: "Mobile games & consumer apps",
    ledeLead: "A job ad gets you 500 CVs to sift through.",
    lede: "Brief us instead: we headhunt, call and screen, then hand you a shortlist of 5 you'd want to hire, within 5 working days.",
  },
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ hero?: string }> }) {
  const { hero } = await searchParams;
  const opt = hero ? HERO_OPTIONS[hero] : undefined;
  return (
    <>
      <HeroPanel
        headline={["500 candidates to 5."]}
        ledeLead={opt?.ledeLead ?? "A job ad gets you 500 CVs to sift through."}
        lede={opt?.lede ?? "Brief us instead: we headhunt, call and screen, then hand you a shortlist of 5 you'd want to hire, within 5 working days."}
        badge={opt?.badge}
        chips={opt?.chips}
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
