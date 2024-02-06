"use client";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";

export async function PaperCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
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
