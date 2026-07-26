const inputClass =
  "w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500";

export type CohortFormValues = {
  name: string;
  starts_at: string;
  schedule_label: string;
  status: "open" | "closed";
  amount_mmk: number;
  sort_index: number;
};

export function CohortForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<CohortFormValues>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
          Batch name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaults?.name ?? ""}
          placeholder="Batch 1"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="starts_at"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Start date
        </label>
        <input
          id="starts_at"
          name="starts_at"
          type="date"
          required
          defaultValue={defaults?.starts_at ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="schedule_label"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Schedule
        </label>
        <input
          id="schedule_label"
          name="schedule_label"
          type="text"
          required
          defaultValue={defaults?.schedule_label ?? ""}
          placeholder="Every Weekend, 9:00 - 10:30 AM (MMT)"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="amount_mmk"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Regular price (MMK)
        </label>
        <input
          id="amount_mmk"
          name="amount_mmk"
          type="number"
          min={0}
          step={1000}
          required
          defaultValue={defaults?.amount_mmk ?? 400000}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaults?.status ?? "open"}
          className={inputClass}
        >
          <option value="open">Active</option>
          <option value="closed">Inactive</option>
        </select>
        <p className="mt-1 text-xs text-slate-500">
          Only active cohorts appear on the public enroll form.
        </p>
      </div>

      <div>
        <label
          htmlFor="sort_index"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Sort order
        </label>
        <input
          id="sort_index"
          name="sort_index"
          type="number"
          defaultValue={defaults?.sort_index ?? 0}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
      >
        {submitLabel}
      </button>
    </form>
  );
}
