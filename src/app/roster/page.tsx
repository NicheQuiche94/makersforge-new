import type { Metadata } from "next";
import { Suspense } from "react";
import { RosterHero } from "@/components/sections/RosterHero";
import { RosterLiveStrip } from "@/components/sections/RosterLiveStrip";
import { RosterApp } from "@/components/sections/RosterApp";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "The lineup · MakersForge",
  description:
    "Filter to the senior UA managers and marketing artists we represent. Profiles anonymised; real identities reveal after a brief.",
};

/* Per Andre 2026-05-30 v6: the pricing-style compact CTABand moved
   here. When a studio doesn't find the right fit on the lineup, the
   bottom CTA lets them brief us directly so we can shortlist by hand
   from our wider network. */
export default function RosterPage() {
  return (
    <>
      <RosterHero />
      <RosterLiveStrip />
      <Suspense fallback={<div style={{ padding: 60 }} />}>
        <RosterApp />
      </Suspense>
      <CTABand
        compact
        headline={
          <>
            Can&apos;t find the right{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>fit?</em>
          </>
        }
        body="Tell us about you, your company, your culture, your product and a few other details so we can personalise your talent pipeline."
        cta={{ label: "Book a briefing", href: "/enquire" }}
      />
    </>
  );
}
