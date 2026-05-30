import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import "@fontsource/cal-sans";
import "./globals.css";

import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/atoms/ScrollProgress";
import { ScrollRevealRoot } from "@/components/atoms/ScrollRevealRoot";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "MakersForge: Growth team specialists for mobile apps & games",
  description:
    "A live lineup of senior UA managers and marketing artists for mobile apps and games. Pay them direct, pay us a flat monthly fee. No percentage games.",
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
        <ScrollProgress />
        <TopNav />
        <main id="main">{children}</main>
        <Footer />
        <ScrollRevealRoot />
      </body>
    </html>
  );
}
