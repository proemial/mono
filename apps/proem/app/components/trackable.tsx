"use client";
import { Tracker } from "@/app/components/analytics/tracking/tracker";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	trackingKey: string;
};

export function Trackable({ children, trackingKey }: Props) {
	return (
		<div className="h-full w-full" onClick={() => Tracker.track(trackingKey)}>
			{children}
		</div>
	);
}
