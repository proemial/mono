"use client";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";
import { ReactNode } from "react";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type Props = {
  id: string;
  children: ReactNode;
};

export async function ClickablePaperCard({ id, children }: Props) {
  const handleClick = () => {
    Tracker.track(analyticsKeys.feed.click.card, { id });
  };

  return (
    <div>
      <Link href={`/oa/${id}`} onClick={handleClick}>
        {children}
      </Link>
    </div>
  );
}
