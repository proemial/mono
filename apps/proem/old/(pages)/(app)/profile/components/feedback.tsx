"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";
import { MegaPhone } from "@/app/components/icons/objects/megaphone";
import Link from "next/link";

export function Feedback() {
	return (
		<Link
			className="hover:bg-[#2F2F2F] p-2 outline-none outline-transparent transition duration-300 ease-in-out select-none items-center relative group justify-center text-center rounded-sm cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex font-medium"
			href="https://tally.so/r/wAv8Ve"
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => Tracker.track(analyticsKeys.profile.click.feedback)}
		>
			<div className="flex items-center justify-center gap-3 leading-none">
				<MegaPhone />
				<div className="relative text-sm font-normal text-align-center">
					Feedback
				</div>
			</div>
		</Link>
	);
}
