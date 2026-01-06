import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <html lang="en" className={inter.variable}>
        <body className="bg-brand-black text-white antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}