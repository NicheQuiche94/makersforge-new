import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const calSans = localFont({
  src: "../../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MakersForge | The Mobile Gaming Talent Specialists",
  description: "Stop explaining what hybridcasual means to tech agencies and start getting the right talent, every time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#E8491F",
          colorBackground: "#0A0A0A",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
        },
      }}
    >
      <html lang="en" className={`${calSans.variable} ${inter.variable}`}>
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
        <body className="bg-brand-black text-white antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}