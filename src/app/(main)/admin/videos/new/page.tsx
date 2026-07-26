import Link from "next/link";
import { CourseForm } from "../CourseForm";

export default function NewVideoPage() {
  return (
    <div>
      <Link href="/admin/videos" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to courses
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">New course</h2>

      <CourseForm mode="create" />
    </div>
  );
}
