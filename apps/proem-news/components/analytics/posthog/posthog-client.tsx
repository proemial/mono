"use client";
import {
	TrackingInput,
	analyticsTrace,
	usePathNames,
	useTrackingProfile,
} from "@/components/analytics/tracking/tracking-profile";
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
		// Don't initialize twice
		if (initialized) return;

		// memory: do not persist in cookies/local storage for anonymous eu citizens
		const persistence = trackingProfile !== "tracked" ? "memory" : undefined;

		// false: do not capture events for internal users
		const disableTracking = false;

		const token = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
		const api_host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

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
	}, [trackingProfile, initialized]);

	useEffect(() => {
		if (initialized) {
			Tracker.trackPage.posthog(trackingKey, pathname);
		}
	}, [initialized, pathname, trackingKey]);

	return initialized && identified;
}
