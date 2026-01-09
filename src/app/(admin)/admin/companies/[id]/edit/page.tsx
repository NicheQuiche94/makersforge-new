import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyForm } from "@/components/admin/CompanyForm";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !company) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href={`/admin/companies/${id}`}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Company
        </Link>
        <h1 className="text-3xl font-bold text-white font-heading">
          Edit {company.name}
        </h1>
      </div>

      <CompanyForm company={company} />
    </div>
  );
}