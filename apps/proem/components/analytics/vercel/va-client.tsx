"use client";
import {
	analyticsTrace,
	usePathNames,
} from "@/components/analytics/tracking/tracking-profile";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { Tracker } from "../tracking/tracker";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient() {
	const initialized = useInit();
	const { pathname, trackingKey } = usePathNames();

	useEffect(() => {
		if (initialized) {
			Tracker.trackPage.vercel(trackingKey, pathname);
		}
	}, [initialized, pathname, trackingKey]);

	return (
		<>
			{initialized && (
				<>
					<SpeedInsights />
					<VercelAnalytics />
				</>
			)}
		</>
	);
}

function useInit() {
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (!initialized) {
			analyticsTrace("[VaClient] initializing");
			setInitialized(true);
		}
	});

	return initialized;
}
