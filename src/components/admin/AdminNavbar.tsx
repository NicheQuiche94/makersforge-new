"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Users, Briefcase, LayoutDashboard } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/candidates", label: "Candidates", icon: Users },
    { href: "/admin/processes", label: "Processes", icon: Briefcase },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <img
                src="/images/mf-icon-white.png"
                alt="MakersForge"
                className="h-8 w-auto"
              />
              <span className="text-xs font-medium text-brand-orange border border-brand-orange/30 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || 
                  (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
}