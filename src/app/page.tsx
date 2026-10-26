import { BOOKING_URL } from "@/lib/site";
import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { LogoWall } from "@/components/sections/LogoWall";
import { Explainer } from "@/components/sections/Explainer";
import { WhatWeCover } from "@/components/sections/WhatWeCover";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { HeatBreak } from "@/components/sections/HeatBreak";
import { FAQ } from "@/components/sections/FAQ";
import { CaseStudy, TalentDirectory, Testimonials } from "@/components/sections/ProofSections";
import { QuickBrief } from "@/components/sections/QuickBrief";

// 2026-10-27: home rebuilt around the service Andre sells and the outreach
// pitches — "From 500 candidates to 5" — so a click from an email lands on
// page two of that email: promise → proof → how → bench → brief.
const DESCRIPTION =
  "Recruitment for mobile games and consumer apps. We headhunt the people who never see your job ad and hand you 5 screened candidates in 5 working days. Flat £12,000 per hire.";

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
        ledeLead="A job ad gets you 500 CVs to sift through."
        lede="Brief us instead: we headhunt, call and screen, then hand you a shortlist of 5 you'd want to hire, within 5 working days."
        ctas={{
          primary: { href: "#brief", label: "Try us: 3 free profiles" },
          secondary: { href: BOOKING_URL, label: "Book a 15-min call" },
        }}
        links={[
          { href: "/games", label: "For mobile game studios" },
          { href: "/apps", label: "For app companies" },
          { href: "/talent", label: "Looking for a role?" },
        ]}
      />
      {/* 2026-10-27 flow: outcome → how → proof → why not an ad → bench
          → roles → doubts → brief. Comparison table lives on /pricing. */}
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
      <FAQ />
    </>
  );
}
