"use client";
import Link from "next/link";
import { Tracker } from "@/app/components/analytics/tracker";

export function Privacy() {
  return (
    <div className="inset-x-0 px-4 bottom-5">
      <p className="font-sans text-xs font-normal leading-snug text-left text-gray-500">
        Proemial reserves all rights. Read our{" "}
        <Link
          href="/privacy"
          className="underline"
          onClick={() => Tracker.track(`click:profile-privacy`)}
        >
          Privacy Policy.
        </Link>
      </p>
      <p className="font-sans text-xs font-normal leading-snug text-left text-gray-500">
        Proemial ApS. DK-8000 Aarhus C. CVR no.: 44250543. Email:
        hi@proemial.ai.
      </p>
    </div>
  );
}
