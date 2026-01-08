import { HexagonBackground } from "@/components/marketing/HexagonBackground";
import { GradientBlur } from "@/components/marketing/GradientBlur";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col relative">
      <HexagonBackground />
      <GradientBlur position="top-right" size="lg" color="orange" intensity="medium" />
      <GradientBlur position="bottom-left" size="md" color="orange" intensity="low" />
      
      {/* Header with just the logo */}
      <header className="relative z-10 px-6 py-4 border-b border-white/10">
        <Link href="/">
          <img
            src="/images/mf-icon-white.png"
            alt="MakersForge"
            className="h-10 w-auto"
          />
        </Link>
      </header>
      
      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-12">
        {children}
      </div>
    </div>
  );
}