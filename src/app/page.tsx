import type { Metadata } from "next";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { LogoWall } from "@/components/sections/LogoWall";
import { ThreeServices } from "@/components/sections/ThreeServices";
import { Explainer } from "@/components/sections/Explainer";
import { WhatWeCover } from "@/components/sections/WhatWeCover";
import { HowItWorksBento } from "@/components/sections/HowItWorksBento";
import { Principles } from "@/components/sections/Principles";
import { HeatBreak } from "@/components/sections/HeatBreak";
import { DualClose } from "@/components/sections/DualClose";

export const metadata: Metadata = {
  title: "MakersForge: Hiring for mobile games & consumer apps",
  description:
    "The home for the teams behind mobile games and consumer apps. Representation for vetted growth, product, design, engineering and art talent, recruitment for the companies hiring them, and a free job board for both.",
  openGraph: {
    title: "MakersForge: Hiring for mobile games & consumer apps",
    description:
      "Representation, recruitment and a free job board for growth, product, design, engineering and art talent in mobile games and consumer apps.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroPanel />
      <LogoWall />
      <ThreeServices />
      <Explainer />
      <HeatBreak />
      <WhatWeCover />
      <HowItWorksBento />
      <HeatBreak />
      <Principles />
      <DualClose />
    </>
  );
}
