import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyForm } from "@/components/admin/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      <h1 className="text-3xl font-bold text-white font-heading mb-2">Add New Company</h1>
      <p className="text-white/60 mb-8">Add a new company to your CRM for BD tracking.</p>

      <CompanyForm />
    </div>
  );
}