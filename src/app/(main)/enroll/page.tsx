import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getEnrollmentCatalog } from "@/lib/enroll/catalog";
import { getEnrollBankDetails } from "@/lib/enroll/config";
import EnrollWizard from "./EnrollWizard";

export const dynamic = "force-dynamic";

export default async function EnrollPage() {
  const catalog = await getEnrollmentCatalog("foundations");
  const bank = getEnrollBankDetails();

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white ios-spring"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-8">
        <p className="text-sm font-medium" style={{ color: "var(--ios-purple)" }}>
          Apply / {catalog.title} · application
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Reserve your seat.</h1>
        </div>
        <p className="mt-2 text-slate-400">
          Complete the steps below to apply for {catalog.title}.
        </p>
      </div>

      <EnrollWizard catalog={catalog} bank={bank} />
    </div>
  );
}
