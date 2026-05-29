import type { Metadata } from "next";
import { PricingHero } from "@/components/sections/PricingHero";
import { PricingGrid } from "@/components/sections/PricingGrid";
import { ComparisonStrip } from "@/components/sections/ComparisonStrip";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Pricing — MakersForge",
  description:
    "One flat fee. No percentage games. Flat monthly fee for contractors, flat £10,000 for permanent placement.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingGrid />
      <ComparisonStrip />
      <FAQ />
      <CTABand
        headline={
          <>
            still working out{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>
              the shape of the hire?
            </em>
          </>
        }
        body="Twenty minutes on a call. Tell us the role, the bar, the timeline. We'll have names for you the same week, and a clear quote."
      />
    </>
  );
}
