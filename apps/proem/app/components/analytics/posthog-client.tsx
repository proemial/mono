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

	useEffect(() => {
		// wait for clerk to load to bootstrap with
		if (!trackingProfile) return;

		const persistence = trackingProfile === "tracked" ? "memory" : undefined;
		const autocapture = user?.isInternal ? false : true;
		const distinctID = user?.email || user?.id;

		const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const api_host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		analyticsTrace("[PosthogClient] initializing", `distinctID: ${distinctID}, persistence: ${persistence}, autocapture: ${autocapture}`);
		posthog.init(token, {
			api_host,
			persistence,
			autocapture,
			bootstrap: {
				distinctID,
			},
		});
		setInitialized(true);
	}, [user, trackingProfile]);

	return initialized;
}
