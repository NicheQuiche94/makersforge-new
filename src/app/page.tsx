import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Explainer } from "@/components/sections/Explainer";
import { WhatWeCover } from "@/components/sections/WhatWeCover";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { Principles } from "@/components/sections/Principles";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { ForTalentBanner } from "@/components/sections/ForTalentBanner";
import { CTABand } from "@/components/sections/CTABand";
import { ROSTER } from "@/data/roster";

/* Three tiles — trimmed from four per Andre 2026-07-02. The
   'UA + ASO + Creative' tile didn't earn its space now that WhatWeCover
   below lists the coverage properly. Region + fee + representation
   length remain as the three at-a-glance facts. */
const HOME_STATS = [
  {
    n: <span className="gr">EMEA</span>,
    label: "Europe, Middle East, Africa",
  },
  { n: <span className="gr">Flat</span>, label: "Monthly fee, no markup" },
  { n: <span className="gr">∞</span>, label: "Indefinite representation" },
];

export const metadata: Metadata = {
  title: "MakersForge: Growth team specialists for mobile apps & games",
  description:
    "A live lineup of vetted UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.",
  openGraph: {
    title:
      "MakersForge: Growth team specialists for mobile apps & games",
    description:
      "A live lineup of vetted UA managers and marketing artists. Flat monthly fees, no percentage games.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel />
      <StatStrip cells={HOME_STATS} />
      <Explainer />
      <WhatWeCover />
      <HowItWorksBento />
      <Principles />
      {/* RosterCarousel suppressed — its internal PROFILES array is
          hardcoded dummies, not real ROSTER data, so showing it next
          to a real lineup on /line-up would mislead. Re-enable once
          the carousel is refactored to read from ROSTER. */}
      {false && ROSTER.length > 0 && <RosterCarousel />}
      <ForTalentBanner />
      <CTABand
        compact
        body="Tell us about your team and what you're building. We'll point you at the people on the lineup who fit."
        cta={{ label: "Get in touch", href: "/enquire" }}
      />
    </>
  );
}
