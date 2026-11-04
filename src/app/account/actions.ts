"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sessionEmail } from "@/lib/onboarding/auth";
import { bookingsForEmail } from "@/lib/onboarding/records";

/** A 5-minute download link for one of THEIR signed terms PDFs (checked against the signed-in email). */
export async function termsLink(bookingId: string) {
  const email = await sessionEmail();
  if (!email) return null;
  const mine = (await bookingsForEmail(email)).find((b) => b.id === bookingId);
  if (!mine?.terms_pdf_path) return null;
  const { data } = await createAdminClient().storage.from("onboarding").createSignedUrl(mine.terms_pdf_path, 300);
  return data?.signedUrl ?? null;
}

export async function signOut() {
  const { createServerSupabase } = await import("@/lib/supabase/server");
  await (await createServerSupabase()).auth.signOut();
}
