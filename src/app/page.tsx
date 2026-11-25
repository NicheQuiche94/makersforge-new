import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { LogoWall } from "@/components/sections/LogoWall";
import { FAQ } from "@/components/sections/FAQ";
import { CaseStudy, TalentDirectory } from "@/components/sections/ProofSections";
import { OddsStrip, NotAlways, GuideFeature, HomeClose } from "@/components/sections/HomeRefresh";

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
      {/* Homepage refresh (Andre 2026-11-25, MOCK, DRAFT copy): D2C positioning.
          Flow: promise → the odds → proof → how → the honest bit → bench → close → doubts. */}
      <HeroPanel
        headline={["D2C recruitment."]}
        ledeLead="For mobile games and apps."
        lede="Job ads reach whoever's nearby. We reach the person you want."
        ctas={{
          // 2026-11-09 (Andre): a 63% bounce rate; a free tool to click first, not "talk to us".
          primary: { href: "/compare", label: "Design your hiring route" },
          secondary: { href: "/start", label: "Get started" },
        }}
      />
      <LogoWall />
      <NotAlways />
      <OddsStrip />
      <GuideFeature />
      <CaseStudy />
      <TalentDirectory title="5 people worth hiring, in 5 working days." />
      <HomeClose />
      <FAQ />
    </>
  );
}
