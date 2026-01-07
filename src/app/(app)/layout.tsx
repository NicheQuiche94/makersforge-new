import { AppNavbar } from "@/components/app/AppNavbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      <main className="pt-20 min-h-screen bg-brand-black">{children}</main>
    </>
  );
}