import Link from "next/link";
import { createChallenge } from "../actions";

export default function NewChallengePage() {
  return (
    <div>
      <Link href="/admin/challenges" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to challenges
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">New Challenge</h2>

      <form action={createChallenge} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
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
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="rules" className="block text-sm font-medium text-slate-300 mb-2">
            Rules
          </label>
          <textarea
            id="rules"
            name="rules"
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="prize" className="block text-sm font-medium text-slate-300 mb-2">
            Prize
          </label>
          <input
            id="prize"
            name="prize"
            type="text"
            placeholder="$500, Certificate, etc."
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-slate-300 mb-2">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-slate-300 mb-2">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
          >
            Create Challenge
          </button>
          <Link
            href="/admin/challenges"
            className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
