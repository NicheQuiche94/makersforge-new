import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  Settings,
  LogOut
} from "lucide-react";

const ADMIN_EMAIL = "andre@makersforge.gg"; // Your email

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Candidates", href: "/admin/candidates", icon: Users },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Processes", href: "/admin/processes", icon: Briefcase },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black-light border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin">
            <img
              src="/images/mf-icon-white.png"
              alt="MakersForge"
              className="h-8 w-auto"
            />
          </Link>
          <p className="text-white/40 text-xs mt-2">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}