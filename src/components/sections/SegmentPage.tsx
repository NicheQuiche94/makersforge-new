import type { Segment } from "@/data/segments";
import { HeroPanel } from "./HeroPanel";
import { LogoWall } from "./LogoWall";
import { WhatWeCover } from "./WhatWeCover";
import { Explainer } from "./Explainer";
import { HeatBreak } from "./HeatBreak";
import { HowItWorksBento } from "./HowItWorksBento";
import { ComparisonStrip } from "./ComparisonStrip";
import { Principles } from "./Principles";
import { DualClose } from "./DualClose";

/**
 * /games and /apps — the two company doors from the homepage. Same
 * sections as home, minus the three-services overview (this visitor has
 * already told us they're hiring), plus the pricing comparison so the flat
 * fee lands before the close. Copy + roles come from segments.ts.
 */
export function SegmentPage({ segment }: { segment: Segment }) {
  return (
    <>
      <HeroPanel
        kicker={segment.kicker}
        headline={segment.headline}
        lede={segment.lede}
        ctas={{
          primary: { href: `/enquire?industry=${segment.industry}`, label: "Brief us on a hire" },
          secondary: { href: "/line-up", label: "See the lineup" },
        }}
      />
      {segment.showLogoWall ? <LogoWall /> : null}
      <WhatWeCover title={segment.coverTitle} clusters={segment.clusters} />
      <Explainer />
      <HeatBreak />
      <HowItWorksBento />
      <ComparisonStrip />
      <HeatBreak />
      <Principles />
      <DualClose />
    </>
  );
}
