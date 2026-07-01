import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Statement } from "@/components/sections/Statement";
import { WhatWeCover } from "@/components/sections/WhatWeCover";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { ForTalentBanner } from "@/components/sections/ForTalentBanner";
import { CTABand } from "@/components/sections/CTABand";
import { ROSTER } from "@/data/roster";

// Stats reframed per cofounder pass H8 — the dynamic 0/0 counts from
// the empty ROSTER weren't selling. Hardcoded to claims we can defend
// today (region + disciplines + flat fee + indefinite representation).
const HOME_STATS = [
  {
    n: <span className="gr">EMEA</span>,
    label: "Europe, Middle East, Africa",
  },
  {
    n: <span className="gr">Three</span>,
    label: "UA, ASO and Creative disciplines",
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
      <Statement />
      <WhatWeCover />
      <HowItWorksBento />
      {/* RosterCarousel suppressed — its internal PROFILES array is
          hardcoded dummies, not real ROSTER data, so showing it next
          to a real lineup on /roster would mislead. Re-enable once
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
