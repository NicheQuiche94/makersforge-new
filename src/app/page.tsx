import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { LogoWall } from "@/components/sections/LogoWall";
import { FAQ, HOME_FAQ } from "@/components/sections/FAQ";
import { CaseStudy } from "@/components/sections/ProofSections";
import { NotAlways, GuideFeature, HomeClose } from "@/components/sections/HomeRefresh";

// 2026-10-27: home rebuilt around the service Andre sells and the outreach
// pitches — "From 500 candidates to 5" — so a click from an email lands on
// page two of that email: promise → proof → how → bench → brief.
const DESCRIPTION =
  "Direct-to-candidate recruitment for mobile game studios and app companies. We target and engage the right people directly: 5 candidates in 5 working days, from £9,000 per hire, paid only when you hire.";

export const metadata: Metadata = {
  title: "MakersForge: D2C recruitment in mobile games and apps",
  description: DESCRIPTION,
  openGraph: {
    title: "MakersForge: D2C recruitment in mobile games and apps",
    description: DESCRIPTION,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Homepage refresh (Andre 2026-11-25, MOCK, DRAFT copy): D2C positioning.
          Flow: promise → the odds → proof → how → the honest bit → bench → close → doubts. */}
      <HeroPanel
        headline={["D2C* recruitment."]}
        ledeLead="*Direct-to-candidate recruitment in mobile games and apps."
        lede=""
        ctas={{
          // 2026-11-09 (Andre): a 63% bounce rate; a free tool to click first, not "talk to us".
          primary: { href: "/compare", label: "Design your hiring route" },
          secondary: { href: "/start", label: "Get started" },
        }}
      />
      <LogoWall deep />
      <NotAlways />
      <GuideFeature />
      <CaseStudy kicker="D2C in practice" />
      <HomeClose />
      <FAQ compact items={HOME_FAQ} />
    </>
  );
}
