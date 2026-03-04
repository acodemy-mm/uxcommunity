import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Admin Panel</h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage content for UX Community</p>
      </div>

      <nav className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-slate-700 pb-4">
        <Link href="/admin" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Dashboard
        </Link>
        <Link href="/admin/articles" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Articles
        </Link>
        <Link href="/admin/videos" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Videos
        </Link>
        <Link href="/admin/podcasts" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Podcasts
        </Link>
        <Link href="/admin/jobs" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Jobs
        </Link>
        <Link href="/admin/challenges" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Challenges
        </Link>
        <Link href="/admin/users" className="text-slate-400 hover:text-slate-100 font-medium text-sm sm:text-base py-1">
          Users
        </Link>
      </nav>

      {children}
    </div>
  );
}
