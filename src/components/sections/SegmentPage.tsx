import type { Segment } from "@/data/segments";
import { HeroPanel } from "./HeroPanel";
import { LogoWall } from "./LogoWall";
import { WhatWeCover } from "./WhatWeCover";
import { Explainer } from "./Explainer";
import { HeatBreak } from "./HeatBreak";
import { HowItWorksBento } from "./HowItWorksBento";
import { ComparisonStrip } from "./ComparisonStrip";
import { FAQ } from "./FAQ";
import { CaseStudy, TalentDirectory, Testimonials } from "./ProofSections";
import { QuickBrief } from "./QuickBrief";

/**
 * /games and /apps — where most email clicks land. 2026-10-27: same
 * "From 500 candidates to 5" story as home (promise → proof → how → bench →
 * brief), with the segment's own kicker, lede and roles from segments.ts.
 */
export function SegmentPage({ segment }: { segment: Segment }) {
  return (
    <>
      <HeroPanel
        headline={segment.headline}
        ledeLead="A job ad gets you 500 CVs to sift through."
        lede={segment.lede}
        ctas={{
          primary: { href: "#brief", label: "Brief us a role" },
          secondary: { href: `/enquire?industry=${segment.industry}`, label: "Book a 15-min call" },
        }}
      />
      {segment.showLogoWall ? <LogoWall /> : null}
      <HowItWorksBento />
      <CaseStudy />
      <Testimonials />
      <HeatBreak />
      <Explainer />
      <TalentDirectory />
      <WhatWeCover title={segment.coverTitle} clusters={segment.clusters} />
      <FAQ />
      <HeatBreak />
      <QuickBrief industry={segment.industry} />
    </>
  );
}
