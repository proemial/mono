"use client";
import {
	TrackingKey,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";

export function Trackable({
	children,
	trackingKey,
	properties,
}: {
	children: React.ReactNode;
	trackingKey?: TrackingKey;
	properties?: Record<string, string>;
}) {
	if (!trackingKey) {
		return <>{children}</>;
	}
	return <div onClick={trackHandler(trackingKey, properties)}>{children}</div>;
}
