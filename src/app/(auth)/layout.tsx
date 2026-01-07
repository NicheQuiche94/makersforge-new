import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/images/mf-icon-white.png"
                alt="MakersForge"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-heading tracking-tight text-white">
                Makers<span className="text-brand-orange">Forge</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                My Profile
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </div>
        </nav>
      </header>
      <main className="pt-20 min-h-screen bg-brand-black">{children}</main>
    </>
  );
}