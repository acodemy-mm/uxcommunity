import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  const isAdmin = profile?.role === "admin";

  return (
    <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-slate-100">
            UX Community
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/articles" className="text-slate-400 hover:text-slate-100 font-medium">
              Articles
            </Link>
            <Link href="/videos" className="text-slate-400 hover:text-slate-100 font-medium">
              Videos
            </Link>
            <Link href="/podcasts" className="text-slate-400 hover:text-slate-100 font-medium">
              Podcasts
            </Link>
            <Link href="/jobs" className="text-slate-400 hover:text-slate-100 font-medium">
              Jobs
            </Link>
            <Link href="/challenges" className="text-slate-400 hover:text-slate-100 font-medium">
              Challenges
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Admin
              </Link>
            )}

            {user ? (
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-slate-400 hover:text-slate-100 font-medium"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
