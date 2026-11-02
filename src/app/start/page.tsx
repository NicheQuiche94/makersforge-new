import type { Metadata } from "next";
import { Suspense } from "react";
import { StartFlow } from "@/components/onboard/StartFlow";

export const metadata: Metadata = {
  title: "Start a brief · MakersForge",
  robots: { index: false },
};

/* PROTOTYPE 2026-11-02: the self-onboarding flow, fake data, nothing is sent. */
export default function StartPage() {
  return (
    <Suspense>
      <StartFlow />
    </Suspense>
  );
}
