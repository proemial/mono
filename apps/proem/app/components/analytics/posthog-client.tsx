"use client";
import { TrackingInput, analyticsTrace, useTrackingProfile } from "@/app/components/analytics/tracking-profile";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect, useState } from "react";

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

		const persistence = trackingProfile !== "tracked" ? "memory" : undefined;
		const autocapture = user?.isInternal ? false : true;

		const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const api_host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		analyticsTrace("[PosthogClient] initializing", `persistence: ${persistence}, autocapture: ${autocapture}`);
		posthog.init(token, {
			api_host,
			persistence,
			autocapture,
			loaded: (posthog) => {
				if (process.env.NODE_ENV === 'development') posthog.debug()
			},
		});
		setInitialized(true);
	}, [user, trackingProfile]);

	useEffect(() => {
		const distinctID = user?.email || user?.id;

		if (distinctID) {
			analyticsTrace("[PosthogClient] identifying", `distinctID: ${distinctID}`);
			posthog.identify(distinctID);
			setIdentified(true);
		};
	}, [user?.email, user?.id]);

	return initialized && identified;
}
