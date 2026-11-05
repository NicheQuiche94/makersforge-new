import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@fontsource/cal-sans";
import "./globals.css";

import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { ScrollRevealRoot } from "@/components/atoms/ScrollRevealRoot";
import { SiteSchema } from "@/components/seo/SiteSchema";
import { Consent } from "@/components/consent/Consent";
import { FounderChat } from "@/components/chat/FounderChat";
import { PostHog } from "@/components/consent/PostHog";
import { VercelAnalytics } from "@/components/consent/VercelAnalytics";
import { SITE_URL } from "@/lib/site";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

const SITE_NAME = "MakersForge";
const DEFAULT_TITLE =
  "MakersForge: Hiring for mobile games & consumer apps";
const DEFAULT_DESC =
  "A live lineup of vetted growth, product, design, engineering and art talent for mobile apps and games, plus targeted search. Flat fees, no percentage games.";

export const metadata: Metadata = {
  // Resolves every relative URL (per-page canonicals, the OG image) to an
  // absolute one, and clears the Next build warning.
  metadataBase: new URL(SITE_URL),
  // Plain string default (pages set their own fully-branded titles, so no
  // template — a template would double the "| MakersForge" they already carry).
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <SiteSchema />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopNav />
        <main id="main">{children}</main>
        <Footer />
        <ScrollRevealRoot />
        {/* "Message Andre": goes to his Telegram, not a bot */}
        <FounderChat />
        {/* Analytics + Apollo load only after the visitor accepts */}
        <Consent />
        <PostHog />
        <VercelAnalytics />
      </body>
    </html>
  );
}
