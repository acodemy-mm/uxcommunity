"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toggleSave } from "@/app/articles/actions";

interface SaveButtonProps {
  articleId: string;
  articleSlug: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}

export function SaveButton({
  articleId,
  articleSlug,
  initialSaved,
  isAuthenticated,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const newSaved = !saved;
    setSaved(newSaved);

    startTransition(async () => {
      const result = await toggleSave(articleId, articleSlug);
      if (result.error) {
        setSaved(saved);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isAuthenticated ? (saved ? "Unsave" : "Save") : "Sign in to save"}
      className={`flex items-center gap-2 transition-all ios-spring active:scale-90 ${
        saved
          ? "text-[#0A84FF]"
          : "text-slate-400 hover:text-[#0A84FF]"
      } disabled:opacity-60`}
    >
      <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
