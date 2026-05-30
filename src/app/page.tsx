import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { StatStrip } from "@/components/sections/StatStrip";
import { Statement } from "@/components/sections/Statement";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { RosterCarousel } from "@/components/sections/RosterCarousel";
import { CTABand } from "@/components/sections/CTABand";

// Stat values now all gradient (no mixed ink+gradient) per Andre
// 2026-05-30 — the half-ink/half-gradient mix read as "afterthought",
// and going uniform-gradient eases the Cal Sans angularity at this scale.
// Lineup language replaces "operators" per the talent-agency reframe.
const HOME_STATS = [
  { n: <span className="gr">50+</span>, label: "on the lineup" },
  { n: <span className="gr">2</span>, label: "disciplines live" },
  { n: <span className="gr">&lt;7d</span>, label: "avg deployment" },
  { n: <span className="gr">£0</span>, label: "% of salary taken" },
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
      <RosterCarousel />
      <CTABand />
    </>
  );
}
