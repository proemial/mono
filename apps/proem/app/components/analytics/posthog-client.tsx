"use client";
import { analyticsTrace } from "@/app/components/analytics/utils";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect, useState } from "react";

// https://posthog.com/tutorials/cookieless-tracking
export function PostHogClient({ children, region }: { children: ReactNode, region?: string }) {
	console.log("region", region);

	analyticsTrace("[PosthogClient]");
	useInit();

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

function useInit() {
	const { user, isLoaded } = useUser();
	const [initialized, setInitialized] = useState(false);

	analyticsTrace("[PosthogClient] useInit");
	useEffect(() => {
		// wait for clerk to load to bootstrap with
		if (!isLoaded) return;
		const persistence = user ? undefined : "memory";
		const distinctID = user?.primaryEmailAddress?.emailAddress || user?.id;

		const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		const api_host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

		analyticsTrace("[PosthogClient] initializing", persistence, distinctID);
		posthog.init(token, {
			api_host,
			persistence,
			bootstrap: {
				distinctID,
			},
		});
		setInitialized(true);
	}, [user, isLoaded]);

	return initialized;
}
