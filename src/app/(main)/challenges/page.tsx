import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .order("end_date", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Design Challenges</h1>

      <div className="space-y-6">
        {challenges?.length ? (
          challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className="block p-6 bg-[#16162a] rounded-xl border border-slate-700/50 hover:border-indigo-500 transition-all"
            >
              <h2 className="text-xl font-semibold text-slate-100">{challenge.title}</h2>
              {challenge.description && (
                <p className="text-slate-400 mt-2 line-clamp-2">{challenge.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                <span>
                  {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
                </span>
                {challenge.prize && (
                  <span className="text-indigo-400 font-medium">Prize: {challenge.prize}</span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 bg-[#16162a] rounded-xl border border-slate-700/50">
            <p className="text-slate-500">No challenges yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
