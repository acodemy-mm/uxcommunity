import { createClient } from "@/lib/supabase/server";
import type { EnrollmentStatus } from "@/types/database";
import { formatMmk } from "@/lib/enroll/config";
import { EnrollmentActions } from "./EnrollmentActions";

const STATUS_STYLES: Record<EnrollmentStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

type EnrollmentRow = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  education_level?: string | null;
  course_interest?: string | null;
  motivation?: string | null;
  status: EnrollmentStatus;
  amount_mmk?: number | null;
  payment_note?: string | null;
  created_at: string;
  program?: { title: string } | null;
  cohort?: { name: string; starts_at: string; schedule_label: string } | null;
  price_tier?: { label: string; amount_mmk: number; per_seat: boolean } | null;
};

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("student_enrollments")
    .select(
      `
      *,
      program:enrollment_programs(title),
      cohort:enrollment_cohorts(name, starts_at, schedule_label),
      price_tier:enrollment_price_tiers(label, amount_mmk, per_seat)
    `
    )
    .order("created_at", { ascending: false });

  const enrollments = (data ?? []) as EnrollmentRow[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Student Enrollments
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Review and manage student applications
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Cohort / Price
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Date
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="border-b border-slate-700">
                <td className="px-4 py-3">
                  <p className="text-slate-100 font-medium">
                    {enrollment.full_name}
                  </p>
                  {(enrollment.school || enrollment.education_level) && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {[enrollment.school, enrollment.education_level]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  <p>{enrollment.email}</p>
                  {enrollment.phone && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {enrollment.phone}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 max-w-[220px]">
                  <p className="text-slate-200 truncate">
                    {enrollment.program?.title ||
                      enrollment.course_interest ||
                      "—"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {enrollment.cohort
                      ? `${enrollment.cohort.name} · ${enrollment.price_tier?.label ?? "—"}`
                      : "—"}
                  </p>
                  {enrollment.payment_note && (
                    <p
                      className="text-xs text-slate-500 mt-0.5 line-clamp-2"
                      title={enrollment.payment_note}
                    >
                      Note: {enrollment.payment_note}
                    </p>
                  )}
                  {enrollment.motivation && (
                    <p
                      className="text-xs text-slate-500 mt-0.5 line-clamp-2"
                      title={enrollment.motivation}
                    >
                      {enrollment.motivation}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">
                  {enrollment.amount_mmk != null
                    ? formatMmk(enrollment.amount_mmk)
                    : enrollment.price_tier
                      ? formatMmk(enrollment.price_tier.amount_mmk)
                      : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${STATUS_STYLES[enrollment.status]}`}
                  >
                    {enrollment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">
                  {new Date(enrollment.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <EnrollmentActions
                    id={enrollment.id}
                    status={enrollment.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrollments.length === 0 && (
          <p className="p-8 text-center text-slate-500">
            No enrollment applications yet.
          </p>
        )}
      </div>
    </div>
  );
}
