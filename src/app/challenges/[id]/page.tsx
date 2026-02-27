import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !challenge) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/challenges" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">
        ← Back to challenges
      </Link>

      <h1 className="text-4xl font-bold text-slate-100 mb-4">{challenge.title}</h1>
      <p className="text-slate-400 mb-6">
        {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
      </p>

      <div>
        <p className="text-slate-300">{challenge.description}</p>
        {challenge.rules && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Rules</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{challenge.rules}</p>
          </div>
        )}
        {challenge.prize && (
          <div className="mt-6 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
            <h3 className="font-semibold text-indigo-300">Prize</h3>
            <p className="text-indigo-200">{challenge.prize}</p>
          </div>
        )}
      </div>
    </div>
  );
}
