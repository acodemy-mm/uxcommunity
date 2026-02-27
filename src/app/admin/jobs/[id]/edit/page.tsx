import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateJob } from "../../actions";
import { DeleteJobButton } from "./DeleteJobButton";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) notFound();

  return (
    <div>
      <Link href="/admin/jobs" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to jobs
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Edit Job Post</h2>
        <DeleteJobButton id={id} />
      </div>

      <form action={updateJob.bind(null, id)} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={job.title}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={job.company}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={job.description}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={job.location}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="job_type" className="block text-sm font-medium text-slate-300 mb-2">
              Job Type
            </label>
            <select
              id="job_type"
              name="job_type"
              defaultValue={job.job_type}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="salary_range" className="block text-sm font-medium text-slate-300 mb-2">
            Salary Range
          </label>
          <input
            id="salary_range"
            name="salary_range"
            type="text"
            defaultValue={job.salary_range || ""}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="apply_url" className="block text-sm font-medium text-slate-300 mb-2">
            Apply URL
          </label>
          <input
            id="apply_url"
            name="apply_url"
            type="url"
            defaultValue={job.apply_url || ""}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
          >
            Update Job
          </button>
          <Link
            href="/admin/jobs"
            className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
