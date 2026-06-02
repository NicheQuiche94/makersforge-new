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
      {/* Pricing teaser line per cofounder pass P5 — one-line tease
          so studios don't have to navigate to find a number. */}
      <section
        style={{
          textAlign: "center",
          padding: "12px 0 36px",
          fontFamily: "var(--font-figtree), Figtree, system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "17px",
          color: "var(--dim)",
        }}
      >
        From <strong style={{ color: "var(--ink)" }}>£1,000 / specialist / month</strong>.
        Flat fee, no markup.{" "}
        <a
          href="/pricing"
          style={{
            color: "var(--ink)",
            textDecoration: "none",
            borderBottom: "1px solid var(--hair-strong)",
            paddingBottom: "2px",
            marginLeft: "6px",
            fontWeight: 600,
          }}
        >
          See pricing →
        </a>
      </section>
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
