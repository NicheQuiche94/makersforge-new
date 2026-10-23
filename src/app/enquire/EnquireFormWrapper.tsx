"use client";

import { useSearchParams } from "next/navigation";
import { EnquireForm } from "@/components/forms/EnquireForm";

/**
 * Client wrapper that reads ?profile=codename from the URL and
 * passes it into the EnquireForm so the form knows which lineup
 * profile the studio came from.
 */
export function EnquireFormWrapper() {
  const params = useSearchParams();
  const profile = params.get("profile") ?? undefined;
  // ?industry=games|apps from the /games and /apps doors pre-ticks industry.
  const ind = params.get("industry");
  const industry = ind === "games" || ind === "apps" ? ind : undefined;
  return <EnquireForm profileCodename={profile} industry={industry} />;
}
