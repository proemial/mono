"use client";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";
import { ReactNode } from "react";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { ClickFeedback } from "@/app/components/card/paper-card";

type Props = {
  id: string;
  children: ReactNode;
};

export function ClickablePaperCard({ id, children }: Props) {
  const handleClick = () => {
    Tracker.track(analyticsKeys.feed.click.card, { id });
  };

  return (
    <Link href={`/oa/${id}`} onClick={handleClick}>
      <ClickFeedback>{children}</ClickFeedback>
    </Link>
  );
}
