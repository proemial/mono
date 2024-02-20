"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { ReactNode } from "react";

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
