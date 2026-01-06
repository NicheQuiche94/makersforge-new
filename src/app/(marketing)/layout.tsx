import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-20 overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}