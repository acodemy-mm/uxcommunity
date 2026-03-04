"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Lock, Star, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentItem = {
  id: string;
  type: "article" | "video" | "podcast" | "challenge" | "job";
  title: string;
  description?: string;
  href: string;
  date?: string;
  meta?: string;
  thumbnail?: string | null;
  locked?: boolean;
  extra?: string;
};

type Tab = "all" | "article" | "video" | "podcast" | "challenge" | "job";

const TABS: { id: Tab; label: string }[] = [
  { id: "all",       label: "All"        },
  { id: "article",   label: "Articles"   },
  { id: "video",     label: "Courses"    },
  { id: "podcast",   label: "Podcasts"   },
  { id: "challenge", label: "Challenges" },
  { id: "job",       label: "Jobs"       },
];

/* iOS system color palette for cards */
const IOS_PALETTES = [
  { bg: "#0A84FF", accent: "#64D2FF", label: "Course",    grad: "from-[#0A84FF] to-[#5E5CE6]" },
  { bg: "#BF5AF2", accent: "#DA8FFF", label: "Article",   grad: "from-[#BF5AF2] to-[#FF375F]" },
  { bg: "#30D158", accent: "#80FF97", label: "Growth",    grad: "from-[#30D158] to-[#40CBE0]" },
  { bg: "#FF9F0A", accent: "#FFD60A", label: "Design",    grad: "from-[#FF9F0A] to-[#FF6B00]" },
  { bg: "#FF375F", accent: "#FF9FAD", label: "Challenge", grad: "from-[#FF375F] to-[#FF9F0A]" },
  { bg: "#40CBE0", accent: "#A0F0FF", label: "Podcast",   grad: "from-[#40CBE0] to-[#0A84FF]" },
  { bg: "#5E5CE6", accent: "#A8A7FF", label: "Job",       grad: "from-[#5E5CE6] to-[#BF5AF2]" },
  { bg: "#FF9F0A", accent: "#FFD60A", label: "Learn",     grad: "from-[#FF9F0A] to-[#FF375F]" },
] as const;

const TYPE_EMOJI: Record<ContentItem["type"], string> = {
  article:   "📝",
  video:     "🎬",
  podcast:   "🎧",
  challenge: "🏆",
  job:       "💼",
};

const ROW_SPAN = [2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1];

interface BentoGridProps {
  items: ContentItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filtered = activeTab === "all"
    ? items
    : items.filter((i) => i.type === (activeTab === "video" ? "video" : activeTab === "article" ? "article" : activeTab === "podcast" ? "podcast" : activeTab === "challenge" ? "challenge" : "job"));

  const visibleTabs = TABS.filter(
    (t) => t.id === "all" || items.some((i) => i.type === t.id)
  );

  return (
    <div>
      {/* ── iOS Segmented Control ─────────────────────── */}
      <div className="mb-6 overflow-x-auto">
        <div
          className="inline-flex min-w-max gap-0.5 rounded-[10px] p-1"
          style={{ background: "rgba(118,118,128,0.18)" }}
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-[8px] px-4 py-1.5 text-[13px] font-semibold ios-spring whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#2C2C2E] text-white shadow-sm"
                  : "text-[rgba(235,235,245,0.65)] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bento Grid ────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] text-3xl"
            style={{ background: "rgba(118,118,128,0.18)" }}
          >
            <Users className="h-7 w-7" style={{ color: "rgba(235,235,245,0.4)" }} />
          </div>
          <p className="text-[17px] font-semibold text-white mb-1">No content yet</p>
          <p className="text-[15px]" style={{ color: "rgba(235,235,245,0.5)" }}>
            Check back soon for new {activeTab === "all" ? "content" : activeTab + "s"}.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          style={{ gridAutoRows: "clamp(160px, 22vw, 210px)" }}
        >
          {filtered.map((item, idx) => {
            const palette = IOS_PALETTES[idx % IOS_PALETTES.length];
            const span = ROW_SPAN[idx % ROW_SPAN.length];
            const isTall = span === 2;

            return (
              <Link
                key={item.id}
                href={item.locked ? "/auth/login" : item.href}
                style={{ gridRow: `span ${span}` }}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-[20px] p-5 ios-bounce",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  `bg-gradient-to-br ${palette.grad}`,
                  item.locked && "opacity-70"
                )}
              >
                {/* Thumbnail overlay */}
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-overlay"
                  />
                )}

                {/* Decorative glare — iOS-style light refraction */}
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
                  style={{ background: palette.accent }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
                />

                {/* Top: type pill + lock */}
                <div className="relative flex items-start justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <span>{TYPE_EMOJI[item.type]}</span>
                    <span className="uppercase tracking-wide">{item.type}</span>
                  </span>
                  {item.locked && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
                      <Lock className="h-3.5 w-3.5 text-white/80" />
                    </span>
                  )}
                </div>

                {/* Middle: title + desc */}
                <div className="relative my-auto py-2">
                  <h3 className={cn(
                    "font-bold leading-snug text-white drop-shadow-sm",
                    isTall ? "text-xl" : "text-[16px]"
                  )}>
                    {item.title}
                  </h3>
                  {item.description && isTall && (
                    <p className="mt-2 text-[13px] leading-relaxed line-clamp-3 text-white/70">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom: meta + CTA */}
                <div className="relative flex items-end justify-between gap-2">
                  <div className="flex flex-col gap-0.5 text-white/65">
                    {item.meta && (
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <Clock className="h-3 w-3" />
                        {item.meta}
                      </span>
                    )}
                    {item.extra && (
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <Star className="h-3 w-3 fill-current" />
                        {item.extra}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[11px]">{item.date}</span>
                    )}
                  </div>

                  {/* iOS-style frosted pill button */}
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm ios-spring group-hover:bg-white/30">
                    {item.locked ? "Sign in" : "Open"}
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
