import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyForm } from "@/components/admin/CompanyForm";

export default async function EditCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Get company data
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !company) {
    notFound();
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href={`/admin/companies/${params.id}`}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Company Details
      </Link>

      <h1 className="text-3xl font-bold text-white font-heading mb-2">Edit Company</h1>
      <p className="text-white/60 mb-8">Update information for {company.name}</p>

      <CompanyForm company={company} />
    </div>
  );
}
