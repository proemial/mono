"use client";
import { TrackingInput, analyticsTrace, useTrackingProfile } from "@/app/components/analytics/tracking/tracking-profile";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect, useState } from "react";
import { a } from "vitest/dist/suite-ynYMzeLu.js";

// https://posthog.com/tutorials/cookieless-tracking
export function PostHogClient({ children, tracking }: { children: ReactNode, tracking?: TrackingInput }) {
	analyticsTrace("[PosthogClient]");
	useInit(tracking);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

function useInit(trackingInput?: TrackingInput) {
	const { trackingProfile, user } = useTrackingProfile(trackingInput);
	const [initialized, setInitialized] = useState(false);
	const [identified, setIdentified] = useState(false);

	useEffect(() => {
		// wait for clerk to load
		if (!trackingProfile) return;

		// memory: do not persist in cookies/local storage for anonymous eu citizens
		const persistence = trackingProfile !== "tracked" ? "memory" : undefined;

		// false: do not capture events for internal users
		const disableTracking = user?.isInternal;

		const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const api_host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		analyticsTrace("[PosthogClient] initializing", `persistence: ${persistence}, disableTracking: ${disableTracking}`);
		posthog.init(token, {
			api_host,
			persistence,
			autocapture: !disableTracking,
			capture_pageview: !disableTracking,
			capture_pageleave: !disableTracking,
			loaded: (posthog) => {
				if (process.env.NODE_ENV === 'development') posthog.debug()
			},
		});
		setInitialized(true);
	}, [user, trackingProfile]);

	useEffect(() => {
		// we may need to stop overwriting the default distinctID, if we want to keep trafic after initial login
		const distinctID = user?.email || user?.id;

		if (!user?.isInternal && distinctID) {
			analyticsTrace("[PosthogClient] identifying", `distinctID: ${distinctID}`);
			posthog.identify(distinctID);
			setIdentified(true);
		};
	}, [user?.isInternal, user?.email, user?.id]);

	return initialized && identified;
}
