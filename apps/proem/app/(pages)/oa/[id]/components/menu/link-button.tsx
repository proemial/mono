"use client";

import { Tracker } from "@/app/components/analytics/tracker";

export function LinkButton({ url }: { url: string }) {
  const track = () => Tracker.track("click:full_paper", { url });

  return (
    <a
      href={url}
      onClick={track}
      target="_blank"
      className="rounded-sm bg-[#7DFA86] text-black text-xs py-2 px-4 text-center"
    >
      Read the full article
    </a>
  );
}
