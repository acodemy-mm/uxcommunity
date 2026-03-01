import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("video_courses")
    .select("id, title, youtube_url, order_index, created_at")
    .order("order_index");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Courses</h2>
        <Link
          href="/admin/videos/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          New course
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Order</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">YouTube URL</th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos?.map((video) => (
              <tr key={video.id} className="border-b border-slate-700">
                <td className="px-4 py-3 text-slate-400">{video.order_index}</td>
                <td className="px-4 py-3 text-slate-100">{video.title}</td>
                <td className="px-4 py-3 text-slate-400 text-sm truncate max-w-xs">{video.youtube_url}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/videos/${video.id}/access`}
                    className="text-slate-400 hover:text-indigo-400 font-medium mr-4"
                  >
                    Access
                  </Link>
                  <Link
                    href={`/admin/videos/${video.id}/edit`}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!videos || videos.length === 0) && (
          <p className="p-8 text-center text-slate-500">No videos yet.</p>
        )}
      </div>
    </div>
  );
}
