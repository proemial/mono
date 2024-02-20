"use client";

import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";

export function LinkButton({ url }: { url: string }) {
	const track = () =>
		Tracker.track(analyticsKeys.read.click.fullPaper, { url });

	return (
		<a
			href={url}
			onClick={track}
			target="_blank"
			className="rounded-sm bg-green-500 text-black font-normal text-xs py-2 px-4 text-center scale-100 active:scale-[0.98] transition-all duration-100"
			rel="noreferrer"
		>
			Read the full article
		</a>
	);
}
