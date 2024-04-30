"use client";
import { trackHandler } from "@/components/analytics/tracking/tracking-keys";

export function Trackable({
	children,
	trackingKey,
}: { children: React.ReactNode; trackingKey?: string }) {
	if (!trackingKey) {
		return <>{children}</>;
	}
	return <div onClick={trackHandler(trackingKey)}>{children}</div>;
}
