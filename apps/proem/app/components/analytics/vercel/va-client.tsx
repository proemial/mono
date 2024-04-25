"use client";
import {
	TrackingInput,
	analyticsTrace,
	usePathNames,
} from "@/app/components/analytics/tracking/tracking-profile";
import { useUser } from "@clerk/nextjs";
import va from "@vercel/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { Tracker } from "../tracking/tracker";

// https://vercel.com/docs/concepts/analytics/custom-events
export function VaClient() {
	analyticsTrace("[VaClient]");

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
	const { user } = useUser();
	const [initialized, setInitialized] = useState(false);

	analyticsTrace("[VaClient] useInit");

	useEffect(() => {
		if (user) {
			analyticsTrace("[VaClient] initializing");
			setInitialized(true);
		}
	}, [user]);

	return initialized;
}
