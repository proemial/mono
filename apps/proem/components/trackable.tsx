"use client";

import { trackHandler } from "@/app/components/analytics/tracking/tracking-keys";

function Trackable({
	children,
	trackingKey,
}: { children: React.ReactNode; trackingKey: string }) {
	return <div onClick={trackHandler(trackingKey)}>{children}</div>;
}
