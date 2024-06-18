"use client";
import {
	TrackingKey,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";

export function Trackable({
	children,
	trackingKey,
}: { children: React.ReactNode; trackingKey?: TrackingKey }) {
	if (!trackingKey) {
		return <>{children}</>;
	}
	return <div onClick={trackHandler(trackingKey)}>{children}</div>;
}
