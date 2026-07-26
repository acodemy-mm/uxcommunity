import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { SignInGate } from "@/components/SignInGate";

export const dynamic = "force-dynamic";

function getCompanyInitials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      <div className="text-slate-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        {children}
      </div>
    </section>
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Job Posts
        </Link>
        <SignInGate
          title="Sign in to view this job"
          description="Create an account or sign in to view full job details and apply."
        />
      </div>
    );
  }

  const { data: job, error } = await supabase
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) notFound();

  const category = (job as { category?: string }).category ?? job.job_type;
  const logoUrl = (job as { company_logo_url?: string }).company_logo_url;
  const requirements = (job as { requirements?: string | null }).requirements;
  const benefits = (job as { benefits?: string | null }).benefits;
  const skills = (job as { skills?: string | null }).skills;
  const experienceLength = (job as { experience_length?: string | null }).experience_length;
  const workLevel = (job as { work_level?: string | null }).work_level;
  const qualification = (job as { qualification?: string | null }).qualification;
  const companyIndustry = (job as { company_industry?: string | null }).company_industry;
  const companySize = (job as { company_size?: string | null }).company_size;
  const companyFounded = (job as { company_founded?: string | null }).company_founded;
  const companyAddress = (job as { company_address?: string | null }).company_address;

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Job Posts
      </Link>

      {/* Header: logo + title, company + location, actions */}
      <div className="mb-6 rounded-xl border border-slate-700/50 bg-[#16162a] p-6">
        <div className="mb-2">
          <span className="inline-block rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300">
            {category}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-14 w-14 rounded-lg border border-slate-600 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-lg font-semibold text-white">
                {getCompanyInitials(job.company)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white lg:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 text-slate-400">
                By{" "}
                <span className="font-medium text-slate-300">{job.company}</span>
                {" in "}
                <span className="text-slate-400">{job.location}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            >
              <Heart className="h-4 w-4" />
              Save
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            {job.apply_url ? (
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500/90"
              >
                Apply Now
              </a>
            ) : null}
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Posted {formatDate(job.created_at)}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-8">
          <Section title="Description">
            <div className="whitespace-pre-wrap">{job.description}</div>
          </Section>
          {requirements && (
            <Section title="Requirement">
              <div className="whitespace-pre-wrap">{requirements}</div>
            </Section>
          )}
          {benefits && (
            <Section title="Benefits">
              <div className="whitespace-pre-wrap">{benefits}</div>
            </Section>
          )}
          {skills && (
            <Section title="Skills">
              <div className="whitespace-pre-wrap">{skills}</div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-slate-700/50 bg-[#16162a] p-5">
            <h3 className="mb-4 text-base font-semibold text-white">Job Overview</h3>
            <dl className="space-y-3 text-sm">
              {experienceLength && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="font-medium text-slate-200">{experienceLength}</dd>
                </div>
              )}
              {workLevel && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Work Level</dt>
                  <dd className="font-medium text-slate-200">{workLevel}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Employment Type</dt>
                <dd className="font-medium text-slate-200">{job.job_type}</dd>
              </div>
              {qualification && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Qualification</dt>
                  <dd className="font-medium text-slate-200">{qualification}</dd>
                </div>
              )}
              {job.salary_range && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Salary</dt>
                  <dd className="font-medium text-slate-200">{job.salary_range}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-200">{job.location}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-[#16162a] p-5">
            <div className="mb-4 flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg border border-slate-600 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                  {getCompanyInitials(job.company)}
                </div>
              )}
              <h3 className="font-semibold text-white">{job.company}</h3>
            </div>
            <Link
              href="#"
              className="mb-4 block text-sm text-indigo-400 hover:text-indigo-300"
            >
              View Profile
            </Link>
            <dl className="space-y-2 text-sm">
              {companyIndustry && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Industry</dt>
                  <dd className="text-slate-200">{companyIndustry}</dd>
                </div>
              )}
              {companySize && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Company size</dt>
                  <dd className="text-slate-200">{companySize}</dd>
                </div>
              )}
              {companyFounded && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Founded</dt>
                  <dd className="text-slate-200">{companyFounded}</dd>
                </div>
              )}
              {companyAddress && (
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-slate-500">Location</dt>
                  <dd className="text-right text-slate-200">{companyAddress}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
