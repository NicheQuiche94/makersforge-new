import type { Metadata } from "next";
import { PricingHero } from "@/components/sections/PricingHero";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { ComparisonStrip } from "@/components/sections/ComparisonStrip";

export const metadata: Metadata = {
  title: "Pricing · MakersForge",
  description:
    "Flat monthly fee per specialist engaged. Flat £10,000 for permanent placement. No markup on day rate.",
};

/* Per Andre 2026-05-30 v6: bottom CTABand removed from pricing page.
   The two pricing cards already have their own CTAs ("Talk to us
   about a hire" / "Enquire about permanent"), so a third bottom CTA
   was redundant. The pricing-style compact CTA moved to /roster. */
export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingGrid />
      <ComparisonStrip />
    </>
  );
}
