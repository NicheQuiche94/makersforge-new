import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "The handbook · MakersForge",
  robots: { index: false, follow: false },
};

export default function HandbookLoginPage() {
  return <LoginForm />;
}
