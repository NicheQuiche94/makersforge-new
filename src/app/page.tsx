import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Statement } from "@/components/sections/Statement";
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
    n: <span className="gr">2</span>,
    label: "UA managers + Marketing artists",
  },
  { n: <span className="gr">Flat</span>, label: "Monthly fee, no markup" },
  { n: <span className="gr">∞</span>, label: "Indefinite representation" },
];

export const metadata: Metadata = {
  title: "MakersForge: Growth team specialists for mobile apps & games",
  description:
    "A live lineup of senior UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.",
  openGraph: {
    title:
      "MakersForge: Growth team specialists for mobile apps & games",
    description:
      "A live lineup of senior UA managers and marketing artists. Flat monthly fees, no percentage games.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel />
      <StatStrip cells={HOME_STATS} />
      <Statement />
      <HowItWorksBento />
      {ROSTER.length > 0 && <RosterCarousel />}
      <ForTalentBanner />
      <CTABand
        compact
        body="Tell us about you, your company, your culture, your product and a few other details so we can personalise your talent pipeline."
        cta={{ label: "Book a briefing", href: "/enquire" }}
      />
    </>
  );
}
