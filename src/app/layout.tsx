import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import "@fontsource/cal-sans";
import "./globals.css";

import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { ScrollRevealRoot } from "@/components/atoms/ScrollRevealRoot";
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
  "MakersForge: Growth team specialists for mobile apps & games";
const DEFAULT_DESC =
  "A live lineup of vetted UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.";

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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N2YM0TCEXQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N2YM0TCEXQ');
          `}
        </Script>
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopNav />
        <main id="main">{children}</main>
        <Footer />
        <ScrollRevealRoot />
      </body>
    </html>
  );
}
