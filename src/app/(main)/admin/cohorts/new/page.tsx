import Link from "next/link";
import { createCohort } from "../actions";
import { CohortForm } from "../CohortForm";

export default function NewCohortPage() {
  return (
    <div>
      <Link
        href="/admin/cohorts"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to cohorts
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">New cohort</h2>
      <CohortForm action={createCohort} submitLabel="Create cohort" />
    </div>
  );
}
