"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Diamond } from "lucide-react";

interface ArticlesFiltersProps {
  categories: string[];
  selected: string;
}

export function ArticlesFilters({ categories, selected }: ArticlesFiltersProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((category) => {
        const isSelected = category === selected;
        const params = new URLSearchParams();
        if (category !== "All") params.set("category", category);
        if (q) params.set("q", q);
        const href = params.toString() ? `/articles?${params}` : "/articles";

        return (
          <Link
            key={category}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
            }`}
          >
            <Diamond className="h-3.5 w-3.5" />
            {category}
          </Link>
        );
      })}
    </div>
  );
}
