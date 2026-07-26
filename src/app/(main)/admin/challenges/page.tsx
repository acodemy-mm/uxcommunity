import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminChallengesPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, title, start_date, end_date, created_at")
    .order("end_date", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Challenges</h2>
        <Link
          href="/admin/challenges/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          New Challenge
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Start</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">End</th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges?.map((challenge) => (
              <tr key={challenge.id} className="border-b border-slate-700">
                <td className="px-4 py-3 text-slate-100">{challenge.title}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(challenge.start_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(challenge.end_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/challenges/${challenge.id}/edit`}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!challenges || challenges.length === 0) && (
          <p className="p-8 text-center text-slate-500">No challenges yet.</p>
        )}
      </div>
    </div>
  );
}
