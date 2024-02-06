"use client";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";
import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

export async function PaperCard({ id, children }: Props) {
  const handleClick = () => {
    Tracker.track(`click:feed-card`, { id });
  };

  return (
    <div>
      <Link href={`/oa/${id}`} onClick={handleClick}>
        {children}
      </Link>
    </div>
  );
}
