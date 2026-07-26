import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Briefcase, MapPin } from "lucide-react";
import { SignInGate } from "@/components/SignInGate";

export const dynamic = "force-dynamic";

function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

function getCompanyInitials(company: string): string {
  const parts = company.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Job Posts</h1>
        </div>
        <p className="text-slate-400">
          Find UX and design roles
        </p>
      </div>

      {!user ? (
        <SignInGate
          title="Sign in to view job posts"
          description="Create an account or sign in to browse job listings and apply."
        />
      ) : (
        <JobsContent />
      )}
    </div>
  );
}

async function JobsContent() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("job_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs?.length ? (
          jobs.map((job) => {
            const category = (job as { category?: string }).category ?? job.job_type;
            const logoUrl = (job as { company_logo_url?: string }).company_logo_url;
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a] p-5 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="mb-3">
                  <span className="inline-block rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300">
                    {category}
                  </span>
                </div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-12 w-12 rounded-lg border border-slate-600 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                      {getCompanyInitials(job.company)}
                    </div>
                  )}
                  <span className="text-xs text-slate-500">{timeAgo(job.created_at)}</span>
                </div>
                <p className="mb-1 text-sm font-medium text-indigo-400">{job.company}</p>
                <h2 className="mb-3 line-clamp-2 text-lg font-semibold text-white group-hover:text-indigo-300">
                  {job.title}
                </h2>
                <div className="mb-2">
                  <span className="inline-block rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
                    {job.job_type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">{job.location}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-[#16162a] py-24">
            <Briefcase className="mb-4 h-16 w-16 text-slate-600" />
            <p className="text-slate-500">No job posts yet. Check back soon!</p>
          </div>
        )}
    </div>
  );
}
