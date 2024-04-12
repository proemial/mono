"use client";
import { TrackingInput, analyticsTrace, usePathNames, useTrackingProfile } from "@/app/components/analytics/tracking-profile";
import va from "@vercel/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient({ tracking }: { tracking?: TrackingInput }) {
	const { trackingProfile } = useTrackingProfile(tracking);
	if (trackingProfile !== "tracked") return null;

	analyticsTrace("[VaClient]");

	const { pathname, trackingKey } = usePathNames();

	useEffect(() => {
		analyticsTrace("[VaClient] trackPage:", trackingKey, pathname);
		va.track(trackingKey, {
			path: pathname,
		});
	}, [pathname, trackingKey]);

	return (
		<>
			<SpeedInsights />
			<VercelAnalytics />
		</>
	);
}
