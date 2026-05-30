import type { Metadata } from "next";
import { Suspense } from "react";
import { RosterHero } from "@/components/sections/RosterHero";
import { RosterLiveStrip } from "@/components/sections/RosterLiveStrip";
import { RosterApp } from "@/components/sections/RosterApp";

export const metadata: Metadata = {
  title: "The lineup · MakersForge",
  description:
    "Filter to the senior UA managers and marketing artists we represent. Profiles anonymised; real identities reveal after a brief.",
};

export default function RosterPage() {
  return (
    <>
      <RosterHero />
      <RosterLiveStrip />
      <Suspense fallback={<div style={{ padding: 60 }} />}>
        <RosterApp />
      </Suspense>
    </>
  );
}
