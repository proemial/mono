"use client";
import {
	TrackingInput,
	analyticsTrace,
	usePathNames,
	useTrackingProfile,
} from "@/components/analytics/tracking/tracking-profile";
import { env } from "@/env/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect, useState } from "react";
import { Tracker } from "../tracking/tracker";

// https://posthog.com/tutorials/cookieless-tracking
export function PostHogClient({
	children,
	tracking,
}: { children: ReactNode; tracking?: TrackingInput }) {
	analyticsTrace("[PosthogClient]");
	useInit(tracking);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

function useInit(trackingInput?: TrackingInput) {
	const { trackingProfile, user, organisation } =
		useTrackingProfile(trackingInput);
	const [initialized, setInitialized] = useState(false);
	const [identified, setIdentified] = useState(false);
	const { pathname, trackingKey } = usePathNames();

	useEffect(() => {
		// wait for clerk to load
		if (!trackingProfile) return;

		// memory: do not persist in cookies/local storage for anonymous eu citizens
		const persistence = trackingProfile !== "tracked" ? "memory" : undefined;

		// false: do not capture events for internal users
		const disableTracking = user?.isInternal;

		const token = env.NEXT_PUBLIC_POSTHOG_KEY;
		const api_host = env.NEXT_PUBLIC_POSTHOG_HOST;

		analyticsTrace(
			"[PosthogClient] initializing",
			`persistence: ${persistence}, disableTracking: ${disableTracking}`,
		);
		posthog.init(token, {
			api_host,
			persistence,
			autocapture: !disableTracking,
			capture_pageview: !disableTracking,
			capture_pageleave: !disableTracking,
			// loaded: (posthog) => {
			// 	if (process.env.NODE_ENV === "development") posthog.debug();
			// },
		});
		setInitialized(true);
	}, [user, trackingProfile]);

	useEffect(() => {
		// we may need to stop overwriting the default distinctID, if we want to keep trafic after initial login
		const distinctID = user?.email || user?.id;

		const props = organisation
			? { organisation: organisation.name }
			: undefined;
		if (!user?.isInternal && distinctID) {
			analyticsTrace(
				"[PosthogClient] identifying",
				`distinctID: ${distinctID}`,
				`organisation: ${organisation}`,
			);
			posthog.identify(distinctID, props);
			setIdentified(true);
		}
	}, [user?.isInternal, user?.email, user?.id, organisation]);

	useEffect(() => {
		if (initialized) {
			Tracker.trackPage.posthog(trackingKey, pathname);
		}
	}, [initialized, pathname, trackingKey]);

	return initialized && identified;
}
