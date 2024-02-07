"use client";
import { ReactNode } from "react";
import { Tracker } from "@/app/components/analytics/tracker";

type Props = {
  children: ReactNode;
  track: string;
};

export function Trackable({ children, track }: Props) {
  return (
    <div className="h-full w-full" onClick={() => Tracker.track(track)}>
      {children}
    </div>
  );
}
