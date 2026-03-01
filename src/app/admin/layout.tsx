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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Admin Panel</h1>
        <p className="text-slate-400 mt-1">Manage content for UX Community</p>
      </div>

      <nav className="flex flex-wrap gap-4 mb-8 border-b border-slate-700 pb-4">
        <Link href="/admin" className="text-slate-400 hover:text-slate-100 font-medium">
          Dashboard
        </Link>
        <Link href="/admin/articles" className="text-slate-400 hover:text-slate-100 font-medium">
          Articles
        </Link>
        <Link href="/admin/videos" className="text-slate-400 hover:text-slate-100 font-medium">
          Videos
        </Link>
        <Link href="/admin/podcasts" className="text-slate-400 hover:text-slate-100 font-medium">
          Podcasts
        </Link>
        <Link href="/admin/jobs" className="text-slate-400 hover:text-slate-100 font-medium">
          Jobs
        </Link>
        <Link href="/admin/challenges" className="text-slate-400 hover:text-slate-100 font-medium">
          Challenges
        </Link>
        <Link href="/admin/users" className="text-slate-400 hover:text-slate-100 font-medium">
          Users
        </Link>
      </nav>

      {children}
    </div>
  );
}
