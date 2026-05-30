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
  return <EnquireForm profileCodename={profile} />;
}
