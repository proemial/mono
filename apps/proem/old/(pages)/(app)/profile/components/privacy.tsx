"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";
import Link from "next/link";

export function Privacy() {
	return (
		<div className="inset-x-0 px-4 bottom-5">
			<p className="text-xs font-normal leading-snug text-left text-gray-500">
				Proemial reserves all rights. Read our{" "}
				<Link
					href="/privacy"
					className="underline"
					onClick={() => Tracker.track(analyticsKeys.profile.click.privacy)}
				>
					Privacy Policy.
				</Link>
			</p>
			<p className="text-xs font-normal leading-snug text-left text-gray-500">
				Proemial ApS. DK-8000 Aarhus C. CVR no.: 44250543. Email:
				hi@proemial.ai.
			</p>
		</div>
	);
}
