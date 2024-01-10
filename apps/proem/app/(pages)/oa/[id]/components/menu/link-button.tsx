"use client";

import { Tracker } from "@/app/components/analytics/tracker";

export function LinkButton({ url }: { id: string; url: string }) {
  const track = () => Tracker.track("click:full_paper", { url });

  return (
    <a
      href={url}
      onClick={track}
      target="_blank"
      className="rounded-md bg-gradient-to-r from-primary to-primary-gradient text-primary-foreground hover:from-primary/90 hover:to-primary-gradient/90 text-base py-2 px-4 h-10 flex items-center"
    >
      Read the full article
    </a>
  );
}