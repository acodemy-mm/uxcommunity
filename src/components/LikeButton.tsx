"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/articles/actions";

interface LikeButtonProps {
  articleId: string;
  articleSlug: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}

export function LikeButton({
  articleId,
  articleSlug,
  initialLiked,
  initialCount,
  isAuthenticated,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setCount(newLiked ? count + 1 : Math.max(0, count - 1));

    startTransition(async () => {
      const result = await toggleLike(articleId, articleSlug);
      if (result.error) {
        setLiked(liked);
        setCount(count);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isAuthenticated ? (liked ? "Unlike" : "Like") : "Sign in to like"}
      className={`flex items-center gap-2 transition-all ios-spring active:scale-90 ${
        liked
          ? "text-red-500"
          : "text-slate-400 hover:text-red-400"
      } disabled:opacity-60`}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
