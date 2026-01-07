import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("is_admin")
    .eq("clerk_id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <>
      <AdminNavbar />
      <main className="pt-20 min-h-screen bg-brand-black">{children}</main>
    </>
  );
}