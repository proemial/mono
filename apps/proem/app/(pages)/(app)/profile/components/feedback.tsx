"use client";
import { MegaPhone } from "@/app/components/icons/objects/megaphone";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

export function Feedback() {
  return (
    <Link
      className="hover:bg-[#2F2F2F] p-2 outline-none outline-transparent transition duration-300 ease-in-out font-sans select-none items-center relative group justify-center text-center rounded-sm cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex font-medium"
      href="https://tally.so/r/wAv8Ve"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => Tracker.track(analyticsKeys.profile.click.feedback)}
    >
      <div className="flex items-center justify-center gap-3 leading-none">
        <MegaPhone />
        <div className="relative font-sans text-sm font-normal text-align-center">
          Feedback
        </div>
      </div>
    </Link>
  );
}
