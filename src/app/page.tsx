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
  title: "MakersForge: The home for growth teams in games & apps",
  description:
    "The home for mobile games and consumer app growth teams. Representation for vetted UA, growth and marketing-art talent, recruitment for the studios hiring them, and a free job board for both.",
  openGraph: {
    title: "MakersForge: The home for growth teams in games & apps",
    description:
      "Representation, recruitment and a free job board for UA, growth and marketing-art talent in mobile games and consumer apps.",
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
